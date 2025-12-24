(function() {
    'use strict';
    
    const definitions = {
        docs_admin: {
            url: '/docs-admin/swagger.json',
            name: 'Heroic API - Admin',
            path: '/docs-admin'
        },
        docs_customer: {
            url: '/docs-customer/swagger.json',
            name: 'Heroic API - Customer',
            path: '/docs-customer'
        }
    };
    
    function createDefinitionSelector() {
        // Kiểm tra xem đã tạo selector chưa
        if (document.getElementById('swagger-definition-selector')) {
            return;
        }
        
        // Lấy definition từ URL parameter hoặc localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const savedDefinition = localStorage.getItem('swagger-definition') || 'docs_admin';
        const currentDefinition = urlParams.get('primaryName') || savedDefinition;
        
        const selectorHtml = `
            <div style="position: fixed; top: 0; left: 0; right: 0; z-index: 10000; background: #fff; border-bottom: 1px solid #ddd; padding: 10px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 15px; max-width: 1400px; margin: 0 auto;">
                    <label style="font-weight: 600; color: #333; font-size: 14px; white-space: nowrap;">Chọn API Definition:</label>
                    <select id="swagger-definition-selector" style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-width: 250px; cursor: pointer; background: #fff; font-family: inherit;">
                        ${Object.keys(definitions).map(key => 
                            `<option value="${key}">${definitions[key].name}</option>`
                        ).join('')}
                    </select>
                    <span id="swagger-definition-info" style="color: #666; font-size: 13px; margin-left: auto;"></span>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', selectorHtml);
        
        // Thêm padding-top cho swagger-ui để không bị che bởi selector
        const swaggerUi = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
        if (swaggerUi) {
            swaggerUi.style.paddingTop = '60px';
        }
        
        const selector = document.getElementById('swagger-definition-selector');
        const infoSpan = document.getElementById('swagger-definition-info');
        
        selector.value = currentDefinition;
        if (infoSpan) {
            infoSpan.textContent = `Đang tải: ${definitions[currentDefinition].name}`;
        }
        
        selector.addEventListener('change', function(e) {
            const selectedDefinition = e.target.value;
            const definition = definitions[selectedDefinition];
            
            if (!definition) return;
            
            // Lưu vào localStorage
            localStorage.setItem('swagger-definition', selectedDefinition);
            
            // Update URL parameter
            const url = new URL(window.location);
            url.searchParams.set('primaryName', selectedDefinition);
            window.history.pushState({}, '', url);
            
            // Reload Swagger UI với definition mới
            if (infoSpan) {
                infoSpan.textContent = `Đang tải: ${definition.name}...`;
            }
            
            // Kiểm tra xem có Swagger UI instance không
            if (window.ui && window.ui.specSelectors) {
                // Nếu có, reload với URL mới
                window.ui.specActions.updateUrl(definition.url);
                window.ui.specActions.download(definition.url);
            } else {
                // Nếu không có, chuyển đến URL mới
                window.location.href = definition.path + '?primaryName=' + selectedDefinition;
            }
        });
    }
    
    function init() {
        // Đợi Swagger UI load
        const swaggerUi = document.querySelector('.swagger-ui') || document.querySelector('#swagger-ui');
        if (swaggerUi || document.body) {
            createDefinitionSelector();
        } else {
            setTimeout(init, 200);
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

