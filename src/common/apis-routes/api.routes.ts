// src/common/api.routes.ts

// 1. Định nghĩa kiểu để gợi ý code (Intellisense)
export type RouteConfig = {
    path: string;
    tag: string;
};

// 2. Khai báo Route + Tag chung 1 chỗ
export const APP_ROUTES = {
    AUTH: {
        CUSTOMER: {
            LOGIN: { path: 'customers/auth/login', tag: 'Login_Customer' },
            LOGIN_GOOGLE: { path: 'customers/auth/login/google', tag: 'Auth_Customer' },
            REGISTER: { path: 'customers/auth/register', tag: 'Auth_Customer' },
        },
        ADMIN: {
            REGISTER: { path: 'admins/register', tag: 'Register_Admin' },
            LOGIN: { path: 'admins/auth/', tag: 'Login_Admin' },
            EMPLOYEES: { path: 'admins/employees', tag: 'Employees_Admin' },
        },
    },
    LOCATIONS: {
        PROVINCE: { path: 'customers/locations/province', tag: 'Locations' },
        DISTRICTS: { path: 'customers/locations/districts', tag: 'Locations' },
        WARDS: { path: 'customers/locations/wards', tag: 'Locations' },
    },
    UPLOAD: {
        IMAGE: { path: 'customers/upload/image', tag: 'Upload' },
    },
} as const;

// 3. Hàm tiện ích để tự động lấy Tag 
function getUniqueTags(obj: any): string[] {
    const tags = new Set<string>();
    const traverse = (o: any) => {
        for (const key in o) {
            const value = o[key];
            // Nếu object có chứa 'tag' và 'path' -> Nó là RouteConfig -> Lấy tag
            if (value && typeof value === 'object' && 'tag' in value) {
                tags.add(value.tag);
            } else if (typeof value === 'object') {
                traverse(value); // Duyệt tiếp vào sâu hơn
            }
        }
    };
    traverse(obj);
    return Array.from(tags);
}

// 4. Xuất danh sách tag để dùng cho file main.ts
export const ADMIN_TAG_LIST = getUniqueTags(APP_ROUTES.AUTH.ADMIN);
export const CUSTOMER_TAG_LIST = [
    ...getUniqueTags(APP_ROUTES.AUTH.CUSTOMER),
    ...getUniqueTags(APP_ROUTES.LOCATIONS),
    ...getUniqueTags(APP_ROUTES.UPLOAD),
];