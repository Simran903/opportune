-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "provider" TEXT NOT NULL DEFAULT 'local';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId") WHERE "googleId" IS NOT NULL;

