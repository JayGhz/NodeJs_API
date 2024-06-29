import { Request, Response } from 'express';
import { PasswordService } from '../services/password.service';
import prisma from '../models/user';
import { generateToken } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, userName, role } = req.body;
    try {
        const hashedPassword = await PasswordService(password);

        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword,
                userName,
                role
            }
        });

        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}