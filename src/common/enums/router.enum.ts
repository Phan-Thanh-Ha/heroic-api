
export const ROUTER_ENUM = {
    AUTH: {
        CUSTOMER: {
            LOGIN: 'customers/auth/login',
            LOGIN_WITH_EMAIL: 'email',
            LOGIN_WITH_GOOGLE: 'google',
            LOGIN_WITH_FACEBOOK: 'facebook',
            REGISTER: 'customers/auth/register',
        },
        ADMIN: {
            REGISTER: 'admin/auth/register',
        },
    },

    LOCATIONS: {
        PROVINCE: 'customers/locations/province',
        DISTRICTS: 'customers/locations/districts',
        WARDS: 'customers/locations/wards',
    },
} as const;

/**
 * Router Tag Enum - Định nghĩa các tags cho Swagger documentation
 * Sử dụng object structure để nhất quán với ROUTER_ENUM
 */
export const ROUTER_TAG_ENUM = {
    // ============================================
    // MODULE TAGS
    // ============================================
    ADMIN: 'Admin',
    CUSTOMER: 'Customer',
    
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
            REGISTER: 'Register',
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
} as const;