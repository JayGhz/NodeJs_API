import { Request, Response } from 'express';
import { PasswordService } from '../services/password.service';
import prisma from '../models/user';

export const createUser = async (req: Request, res: Response): Promise<void> => {
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

        res.status(201).json({ user });
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany();
        res.status(200).json({ users });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id); // Get user id from request params
    try {
        const user = await prisma.findUnique({ where: { id: userId } }); // Find user by id
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id); // Get user id from request params
    const { email, password, userName, role } = req.body;
    try {
        const hashedPassword = await PasswordService(password);

        const user = await prisma.update({
            where: { id: userId },
            data: {
                email,
                password: hashedPassword,
                userName,
                role
            }
        });

        res.status(200).json({ user });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }

}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id); // Get user id from request params
    try {
        const user = await prisma.delete({ where: { id: userId } }); // Delete user by id
        res.status(200).json({ user });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}