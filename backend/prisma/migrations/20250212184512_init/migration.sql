-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'assistant');

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_phone_idx" ON "Message"("phone");
