/*
  Warnings:

  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "userId",
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isSeenNotification" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
