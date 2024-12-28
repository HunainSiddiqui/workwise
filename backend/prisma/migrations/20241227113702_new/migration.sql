/*
  Warnings:

  - You are about to drop the column `isformfilled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Applicant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lawyer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prisoner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrisonerLawyer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_userid_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "ContactRequest" DROP CONSTRAINT "ContactRequest_lawyerId_fkey";

-- DropForeignKey
ALTER TABLE "ContactRequest" DROP CONSTRAINT "ContactRequest_prisonerId_fkey";

-- DropForeignKey
ALTER TABLE "Lawyer" DROP CONSTRAINT "Lawyer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Prisoner" DROP CONSTRAINT "Prisoner_userId_fkey";

-- DropForeignKey
ALTER TABLE "PrisonerLawyer" DROP CONSTRAINT "PrisonerLawyer_lawyerId_fkey";

-- DropForeignKey
ALTER TABLE "PrisonerLawyer" DROP CONSTRAINT "PrisonerLawyer_prisonerId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isformfilled",
DROP COLUMN "role";

-- DropTable
DROP TABLE "Applicant";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ContactRequest";

-- DropTable
DROP TABLE "Lawyer";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Prisoner";

-- DropTable
DROP TABLE "PrisonerLawyer";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "isavailable" BOOLEAN NOT NULL,
    "row" INTEGER NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);
