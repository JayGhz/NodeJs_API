import express, { NextFunction, Request, Response } from 'express';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controller';
import jwt from 'jsonwebtoken';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware to check if user is authenticated
const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.body.user = decoded;
        next();
    });
}


// Routes
router.post('/', auth, createUser);
router.get('/', auth, getUsers);
router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

export default router;