import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const  PasswordService = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
}