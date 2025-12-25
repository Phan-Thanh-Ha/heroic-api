import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'Heroic@123';
const SALT_ROUNDS = 10;


export const generateHashedDefaultPassword = async (): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(DEFAULT_PASSWORD, salt);
};