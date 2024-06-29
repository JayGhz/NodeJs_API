import { User } from "../models/user.interface"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const generateToken = (user: User): string => {
    const token = jwt.sign({ id: user.id, email: user.email, username: user.userName, role: user.role }, JWT_SECRET, {
        expiresIn: '1h'
    })
    return token
}