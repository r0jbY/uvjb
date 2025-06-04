/*
  Warnings:

  - The `status` column on the `Meeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('pending', 'accepted', 'expired', 'closed');

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "status",
ADD COLUMN     "status" "MeetingStatus" NOT NULL DEFAULT 'pending';
