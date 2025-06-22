-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_jobId_fkey";

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
