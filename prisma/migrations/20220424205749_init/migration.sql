/*
  Warnings:

  - You are about to drop the column `dateSend` on the `RemiderNotification` table. All the data in the column will be lost.
  - You are about to drop the column `sendBy` on the `RemiderNotification` table. All the data in the column will be lost.
  - Added the required column `dateSent` to the `RemiderNotification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentBy` to the `RemiderNotification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "isSeen" SET DEFAULT false;

-- AlterTable
ALTER TABLE "RemiderNotification" DROP COLUMN "dateSend",
DROP COLUMN "sendBy",
ADD COLUMN     "dateSent" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sentBy" TEXT NOT NULL;
