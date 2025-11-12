-- Run this SQL directly on your database to add Google OAuth support
-- You can run this via psql, pgAdmin, or your database management tool

-- Add provider column with default value
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL DEFAULT 'local';

-- Make password optional (nullable)
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- Add googleId column
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;

-- Create unique index on googleId (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId") WHERE "googleId" IS NOT NULL;

