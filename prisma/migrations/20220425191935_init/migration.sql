-- AlterTable
ALTER TABLE "Assessment" ADD COLUMN     "completedDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserOnCriteria" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "criteriaId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserOnCriteria" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnCriteria" ADD FOREIGN KEY ("criteriaId") REFERENCES "Criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
