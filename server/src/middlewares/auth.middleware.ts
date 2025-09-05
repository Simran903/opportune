import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error('ACCESS_TOKEN_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as { id: number; email: string };
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error('Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};