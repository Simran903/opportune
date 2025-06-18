import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { id: number; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};