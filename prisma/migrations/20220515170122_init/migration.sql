/*
  Warnings:

  - You are about to drop the column `isCustom` on the `HealthCheck` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `HealthCheck` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `HealthCheck` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HealthCheck" DROP COLUMN "isCustom",
DROP COLUMN "status",
DROP COLUMN "updatedBy";
