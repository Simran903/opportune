import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from 'zod';
import prisma from "../config/client";

const generateAccessToken = (user: any) => {
  // @ts-ignore
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(18),
  name: z.string(),
});

const signInSchema = z.object({
  email: z.string(),
  password: z.string().min(6).max(18),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6).max(18, "New password must be 6–18 characters"),
});

export const signUp = async (req, res) => {
  const parseResult = signUpSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }
  const { name, email, password } = parseResult.data;

  if (!name || !email || !password) {
    res.status(400).json({ error: "All field are required" });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashpassword = await encryptPassword(password);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashpassword },
    });

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const signIn = async (req, res) => {

  try {
    const parseResult = signInSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }
    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      res.status(404).json({ error: 'Invalid credentials.' });
      return;
    }

    const accesstoken = generateAccessToken(user)

    res.status(200).json({
      message: 'Login successful.',
      accesstoken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const userDetails = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user })
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const updatePassword = async (req, res) => {
  const parseResult = updatePasswordSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }

  const { currentPassword, newPassword } = parseResult.data;

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await encryptPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }
    })

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}