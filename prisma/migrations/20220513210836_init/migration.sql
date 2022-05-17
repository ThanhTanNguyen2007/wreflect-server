-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isRegistered" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "BanningUser" (
    "id" TEXT NOT NULL,
    "startBanned" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endBanned" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BanningUser.userId_unique" ON "BanningUser"("userId");

-- AddForeignKey
ALTER TABLE "BanningUser" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
