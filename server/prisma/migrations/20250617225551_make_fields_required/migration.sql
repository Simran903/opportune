/*
  Warnings:

  - You are about to drop the column `title` on the `Candidate` table. All the data in the column will be lost.
  - Made the column `company` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "company" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;
