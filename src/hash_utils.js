import bcrypt from 'bcrypt';

export const generateSaltedPassword = async (password) => {
    return bcrypt.hash(password, 10);
}

export const comparePasswords = async (password, hash) => {
    return bcrypt.compare(password, hash)
}
