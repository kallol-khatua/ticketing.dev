import bcrypt from 'bcrypt';

export class PasswordService {
    private readonly saltRounds: number;

    constructor(saltRounds: number = 10) {
        this.saltRounds = saltRounds;
    }

    async hashPassword(plainTextPassword: string): Promise<string> {
        return await bcrypt.hash(plainTextPassword, this.saltRounds);
    }

    async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
}