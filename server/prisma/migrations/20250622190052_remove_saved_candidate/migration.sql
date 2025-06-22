/*
  Warnings:

  - You are about to drop the `SavedCandidate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedCandidate" DROP CONSTRAINT "SavedCandidate_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "SavedCandidate" DROP CONSTRAINT "SavedCandidate_userId_fkey";

-- DropTable
DROP TABLE "SavedCandidate";
