/*
  Warnings:

  - You are about to drop the column `number` on the `Phone` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Phone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Phone` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Phone_number_key";

-- AlterTable
ALTER TABLE "Phone" DROP COLUMN "number",
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Phone_phone_key" ON "Phone"("phone");
