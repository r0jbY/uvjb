/*
  Warnings:

  - You are about to drop the column `match` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `notification` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `request` on the `Meeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "match",
DROP COLUMN "notification",
DROP COLUMN "request",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(500),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
