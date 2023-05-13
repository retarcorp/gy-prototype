-- DropForeignKey
ALTER TABLE "TableArrangement" DROP CONSTRAINT "TableArrangement_participantAId_fkey";

-- DropForeignKey
ALTER TABLE "TableArrangement" DROP CONSTRAINT "TableArrangement_participantBId_fkey";

-- AlterTable
ALTER TABLE "TableArrangement" ALTER COLUMN "participantAId" DROP NOT NULL,
ALTER COLUMN "participantBId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TableArrangement" ADD CONSTRAINT "TableArrangement_participantAId_fkey" FOREIGN KEY ("participantAId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableArrangement" ADD CONSTRAINT "TableArrangement_participantBId_fkey" FOREIGN KEY ("participantBId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
