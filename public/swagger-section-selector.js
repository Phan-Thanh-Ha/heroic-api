(function() {
    'use strict';
    
    // Định nghĩa các sections - tự động detect tags từ Swagger document
    // Khi tạo API mới, chỉ cần đảm bảo tag đúng là được tự động filter
    const sections = {
        ALL: {
            label: 'Tất cả',
            tags: [],
        },
        ADMIN: {
            label: 'Admin',
            // Tags bắt đầu với "Admin" hoặc kết thúc bằng "_Admin"
            tagPattern: /^(.*_Admin|Admin.*)$/,
        },
        CUSTOMER: {
            label: 'Customer',
            // Tags không phải Admin (Register, Login, Province, Districts, Wards, Upload_Image, etc.)
            excludePattern: /.*_Admin$/,
        },
        AUTH: {
            label: 'Authentication',
            // Tags liên quan đến auth
            tagPattern: /^(Register|Login|Register_Admin|Login_Admin|Login_Google|Login_Facebook)$/,
        },
        LOCATIONS: {
            label: 'Locations',
            // Tags về địa điểm
            tagPattern: /^(Province|Districts|Wards)$/,
        },
        UPLOAD: {
            label: 'Upload',
            tagPattern: /^Upload_/,
        },
        MAIL: {
            label: 'Mail',
            tagPattern: /^(Send_OTP|Mail.*)$/,
        },
    };
    
    let selectorCreated = false;
    let currentFilter = null;
    let allAvailableTags = [];
    
    function getAllTagsFromDocument() {
        // Lấy tất cả tags từ Swagger document
        const tags = new Set();
        
        // Cách 1: Từ operations
        const operations = document.querySelectorAll('.opblock[data-tag]');
        operations.forEach(op => {
            const tag = op.getAttribute('data-tag');
            if (tag) tags.add(tag);
        });
        
        // Cách 2: Từ tag containers
        const tagContainers = document.querySelectorAll('.opblock-tag');
        tagContainers.forEach(container => {
            let tag = container.getAttribute('data-tag');
            if (!tag) {
                const id = container.id;
                if (id && id.startsWith('operations-tag-')) {
                    tag = id.replace('operations-tag-', '').replace(/-/g, '_');
                }
            }
            if (!tag) {
                const text = container.textContent.trim();
                if (text) {
                    tag = text.split('\n')[0].trim();
                }
            }
            if (tag) tags.add(tag);
        });
        
        return Array.from(tags).sort();
    }
    
    function getTagsForSection(sectionKey) {
        const section = sections[sectionKey];
        if (!section) return [];
        
        if (sectionKey === 'ALL') {
            return allAvailableTags;
        }
        
        if (section.tagPattern) {
            return allAvailableTags.filter(tag => section.tagPattern.test(tag));
        }
        
        if (section.excludePattern) {
            return allAvailableTags.filter(tag => !section.excludePattern.test(tag));
        }
        
        if (section.tags) {
            return section.tags.filter(tag => allAvailableTags.includes(tag));
        }
        
        return [];
    }
    
    function filterBySection(sectionKey) {
        const tags = getTagsForSection(sectionKey);
        
        console.log('Filtering by section:', sectionKey);
        console.log('Available tags:', allAvailableTags);
        console.log('Filter tags:', tags);
        
        // Tìm tất cả các tag elements và operations
        const tagContainers = document.querySelectorAll('.opblock-tag');
        const operations = document.querySelectorAll('.opblock[data-tag]');
        
        let visibleTags = 0;
        
        // Filter tag containers
        tagContainers.forEach(container => {
            let containerTag = container.getAttribute('data-tag');
            
            if (!containerTag) {
                const id = container.id;
                if (id && id.startsWith('operations-tag-')) {
                    containerTag = id.replace('operations-tag-', '').replace(/-/g, '_');
                }
            }
            
            if (!containerTag) {
                const text = container.textContent.trim();
                if (text) {
                    containerTag = text.split('\n')[0].trim();
                }
            }
            
            const tagSection = container.querySelector('.opblock-tag-section');
            
            if (sectionKey === 'ALL' || tags.includes(containerTag)) {
                container.style.display = '';
                if (tagSection) tagSection.style.display = '';
                if (containerTag) visibleTags++;
            } else {
                container.style.display = 'none';
                if (tagSection) tagSection.style.display = 'none';
            }
        });
        
        // Filter operations
        operations.forEach(op => {
            const opTag = op.getAttribute('data-tag');
            if (sectionKey === 'ALL' || tags.includes(opTag)) {
                op.style.display = '';
            } else {
                op.style.display = 'none';
            }
        });
        
        // Update info
        const infoSpan = document.getElementById('swagger-section-info');
        if (infoSpan) {
            if (sectionKey === 'ALL') {
                infoSpan.textContent = `Hiển thị tất cả (${allAvailableTags.length} tag(s))`;
            } else {
                if (visibleTags > 0) {
                    infoSpan.textContent = `Hiển thị ${visibleTags} tag(s)`;
                } else {
                    infoSpan.textContent = `Không có tag nào`;
                }
            }
        }
        
        currentFilter = sectionKey;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function createSectionSelector() {
        if (selectorCreated) {
            return;
        }
        
        if (document.getElementById('swagger-section-selector')) {
            selectorCreated = true;
            return;
        }
        
        // Lấy tất cả tags có sẵn
        allAvailableTags = getAllTagsFromDocument();
        
        if (allAvailableTags.length === 0) {
            console.log('No tags found yet, retrying...');
            setTimeout(createSectionSelector, 500);
            return;
        }
        
        console.log('Available tags:', allAvailableTags);
        
        const selectorHtml = `
            <div style="position: fixed; top: 0; left: 0; right: 0; z-index: 10000; background: #fff; border-bottom: 1px solid #ddd; padding: 10px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 15px; max-width: 1400px; margin: 0 auto;">
                    <label style="font-weight: 600; color: #333; font-size: 14px; white-space: nowrap;">Chọn section:</label>
                    <select id="swagger-section-selector" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-width: 200px; cursor: pointer; background: #fff; font-family: inherit;">
                        ${Object.keys(sections).map(key => 
                            `<option value="${key}">${sections[key].label}</option>`
                        ).join('')}
                    </select>
                    <span id="swagger-section-info" style="color: #666; font-size: 13px; margin-left: auto;"></span>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', selectorHtml);
        
        // Thêm padding-top cho swagger-ui
        const swaggerUi = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
        if (swaggerUi) {
            swaggerUi.style.paddingTop = '60px';
        }
        
        const selector = document.getElementById('swagger-section-selector');
        const infoSpan = document.getElementById('swagger-section-info');
        
        // Lưu selection vào localStorage
        const savedSection = localStorage.getItem('swagger-section') || 'ALL';
        selector.value = savedSection;
        filterBySection(savedSection);
        
        selector.addEventListener('change', function(e) {
            const selectedSection = e.target.value;
            localStorage.setItem('swagger-section', selectedSection);
            filterBySection(selectedSection);
        });
        
        selectorCreated = true;
        
        // Sử dụng MutationObserver để detect khi có tags mới được thêm
        if (swaggerUi) {
            const observer = new MutationObserver(() => {
                const newTags = getAllTagsFromDocument();
                if (newTags.length !== allAvailableTags.length) {
                    allAvailableTags = newTags;
                    if (currentFilter) {
                        filterBySection(currentFilter);
                    }
                }
            });
            
            observer.observe(swaggerUi, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // Đợi Swagger UI load xong và có tags
    function waitForTags(callback, maxAttempts = 50) {
        let attempts = 0;
        const checkTags = () => {
            const tagElements = document.querySelectorAll('.opblock-tag, .opblock[data-tag]');
            const swaggerUi = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
            
            if (tagElements.length > 0 && swaggerUi) {
                callback();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkTags, 200);
            } else {
                callback();
            }
        };
        checkTags();
    }
    
    function init() {
        const swaggerUi = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
        if (swaggerUi) {
            waitForTags(() => {
                createSectionSelector();
            });
        } else {
            setTimeout(init, 300);
        }
    }
    
    // Khởi động ngay khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(init, 300);
        });
    } else {
        setTimeout(init, 300);
    }
    
    // Fallback: thử lại sau 1s và 2s
    setTimeout(init, 1000);
    setTimeout(init, 2000);
})();
