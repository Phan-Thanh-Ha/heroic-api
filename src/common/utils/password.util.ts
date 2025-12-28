import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'Heroic@123';
const SALT_ROUNDS = 10;

// mã hoá password mặc định Heroic@123
export const generateHashedDefaultPassword = async (): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(DEFAULT_PASSWORD, salt);
};

// kiểm tra password có khớp với password mặc định không
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    if (!password || !hash) {
        return false;
    }
    return await bcrypt.compare(password, hash);
};

// mã hoá password khi đăng ký hoặc cập nhật password
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};