/*
  Warnings:

  - You are about to drop the column `location` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `matchScore` on the `Candidate` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "location",
DROP COLUMN "matchScore",
DROP COLUMN "name";
