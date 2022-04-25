/*
  Warnings:

  - A unique constraint covering the columns `[userId,criteriaId]` on the table `UserOnCriteria` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserOnCriteria.userId_criteriaId_unique" ON "UserOnCriteria"("userId", "criteriaId");
