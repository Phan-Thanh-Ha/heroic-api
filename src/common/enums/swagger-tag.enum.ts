/**
 * Enum cho Swagger API Tags
 * Dùng để phân biệt API Admin và Customer
 */
export enum SWAGGER_TAG_ENUM {
    ADMIN = 'Admin',
    CUSTOMER = 'Customer',
}

/**
 * Router Tag Enum - Định nghĩa các tags cho Swagger documentation
 * Sử dụng object structure để nhất quán với ROUTER_ENUM
 */
export const ROUTER_TAG_ENUM = {
    MAIL: {
        SEND_OTP: 'Send_OTP',
    },
    // ============================================
    // MODULE TAGS
    // ============================================
    ADMIN: 'Admin',
    CUSTOMER: 'Customer',
    EMAIL   : 'Email',
    
    // ============================================
    // AUTHENTICATION TAGS
    // ============================================
    AUTH: {
        CUSTOMER: {
            LOGIN: 'Login',
            LOGIN_GOOGLE: 'Login_Google',
            LOGIN_FACEBOOK: 'Login_Facebook',
            REGISTER: 'Register',
        },
        ADMIN: {
            REGISTER: 'Register_Admin',
        },
    },
    
    // ============================================
    // LOCATIONS TAGS
    // ============================================
    LOCATIONS: {
        PROVINCE: 'Province',
        DISTRICTS: 'Districts',
        WARDS: 'Wards',
    },

    // ============================================
    // UPLOAD TAGS
    // ============================================
    UPLOAD: {
        IMAGE: 'Upload_Image',
    },

    // CUSTOMERS: {
    //     LISTCUSTOMER: 'List_Customer',
    // },
} as const;

