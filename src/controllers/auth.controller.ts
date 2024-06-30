import { Request, Response } from 'express';
import { PasswordService, comparePasswords } from '../services/password.service';
import prisma from '../models/user';
import { generateToken } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, userName, role } = req.body;
    if (!email || !password || !userName || !role) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
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
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    try {
        const user = await prisma.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const match = await comparePasswords(password, user.password);
        if (!match) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user);
        res.status(200).json({ token });

    } catch (error: any) {
        console.log(error);
    }
}