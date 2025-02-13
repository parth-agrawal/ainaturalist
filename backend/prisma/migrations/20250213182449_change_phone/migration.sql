/*
  Warnings:

  - You are about to drop the column `phone` on the `Phone` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `Phone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Phone` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Phone_phone_key";

-- AlterTable
ALTER TABLE "Phone" DROP COLUMN "phone",
ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Phone_number_key" ON "Phone"("number");
