
export const ROUTER_ENUM = {
    EMAIL: 'email',
    AUTH: {
        CUSTOMER: {
            LOGIN: 'customers/auth',
            LOGIN_WITH_EMAIL: 'login/email',
            LOGIN_WITH_GOOGLE: 'login/google',
            LOGIN_WITH_FACEBOOK: 'login/facebook',
            VERIFY_OTP: 'verify-otp',
            REGISTER: 'customers/auth/register',
        },
        ADMIN: {
            REGISTER: 'admins/auth/register',
            LOGIN: 'admins/auth/login',
            EMPLOYEES: 'admins/employees',
        },
    },

    LOCATIONS: {
        PROVINCE: 'customers/locations/province',
        DISTRICTS: 'customers/locations/districts',
        WARDS: 'customers/locations/wards',
    },

    UPLOAD: {
        IMAGE: 'customers/upload/image',
    },
}