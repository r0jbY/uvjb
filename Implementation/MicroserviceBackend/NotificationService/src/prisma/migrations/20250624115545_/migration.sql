/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "PushToken" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "PushToken_pkey" PRIMARY KEY ("userId","token")
);
