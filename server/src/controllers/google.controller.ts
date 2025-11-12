import { OAuth2Client } from 'google-auth-library';
import jwt from "jsonwebtoken";
import prisma from "../config/client";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const googleSignIn = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token is required' });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required from Google' });
    }

    // Check if user exists by email or googleId
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { googleId }
        ]
      }
    });

    if (user) {
      // Update user if they signed in with email before but now using Google
      if (!user.googleId && googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            provider: 'google',
            // Keep existing password in case they want to use email login later
          }
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          provider: 'google',
          password: null, // OAuth users don't have passwords
        }
      });
    }

    const accesstoken = generateAccessToken(user);

    res.status(200).json({
      message: 'Google sign-in successful.',
      accesstoken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    
    // Provide more detailed error messages
    if (error.message) {
      console.error('Error details:', error.message);
    }
    
    // Check if it's a database schema issue
    if (error.code === 'P2002' || error.message?.includes('Unknown arg')) {
      return res.status(500).json({ 
        error: 'Database schema error. Please run: npx prisma migrate dev',
        details: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

