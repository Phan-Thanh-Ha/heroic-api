// src/common/api.routes.ts

export type RouteConfig = {
    path: string;
    tag: string;
};

export const APP_ROUTES = {

    // ------------------------------------------
    // Cụm dành cho QUẢN TRỊ VIÊN
    // ------------------------------------------
    ADMIN: {
        AUTH: {
            REGISTER: { path: 'admins/register', tag: 'Admin_Auth' },
            LOGIN: { path: 'admins/auth/', tag: 'Admin_Auth' },
        },
        EMPLOYEES: { path: 'admins/employees', tag: 'Admin_Employees' },
        CATEGORY: {path: 'admin/category', tag: 'Admin_Category'},
        UPLOAD: {
            IMAGE: { path: 'admins/upload/image', tag: 'Admin_Upload' },
        },
        EMAIL: {
            SEND_OTP: { path: 'customers/email/send-otp', tag: 'Customer_Email' },
        },
    },

    // ------------------------------------------
    // Cụm dành cho KHÁCH HÀNG
    // ------------------------------------------
    CUSTOMER: {
        AUTH: {
            LOGIN: { path: 'customers/auth/login', tag: 'Customer_Auth' },
            LOGIN_GOOGLE: { path: 'customers/auth/login/google', tag: 'Customer_Auth' },
            REGISTER: { path: 'customers/auth/register', tag: 'Customer_Auth' },
        },
        LIST: { path: 'customers/list', tag: 'Customer_List' },
        LOCATIONS: {
            PROVINCE: { path: 'customers/locations/province', tag: 'Customer_Locations' },
            DISTRICTS: { path: 'customers/locations/districts', tag: 'Customer_Locations' },
            WARDS: { path: 'customers/locations/wards', tag: 'Customer_Locations' },
        },
        UPLOAD: {
            IMAGE: { path: 'customers/upload/image', tag: 'Customer_Upload' },
        },
        EMAIL: {
            SEND_OTP: { path: 'customers/email/send-otp', tag: 'Customer_Email' },
        },
    },
} as const;

// 2. Hàm tiện ích (Giữ nguyên logic của bạn)
function getUniqueTags(obj: any): string[] {
    const tags = new Set<string>();
    const traverse = (o: any) => {
        for (const key in o) {
            if (o[key] && typeof o[key] === 'object') {
                if ('tag' in o[key] && 'path' in o[key]) {
                    tags.add(o[key].tag);
                } else {
                    traverse(o[key]);
                }
            }
        }
    };
    traverse(obj);
    return Array.from(tags);
}

// 3. Xuất danh sách tag
// ADMIN_TAG_LIST bây giờ sẽ tự động bao gồm 'Admin_Upload'
export const ADMIN_TAG_LIST = getUniqueTags(APP_ROUTES.ADMIN);

// CUSTOMER_TAG_LIST sẽ bao gồm 'Customer_Upload'
export const CUSTOMER_TAG_LIST = getUniqueTags(APP_ROUTES.CUSTOMER);
