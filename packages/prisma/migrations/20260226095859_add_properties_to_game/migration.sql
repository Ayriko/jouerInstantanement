/*
  Warnings:

  - Added the required column `coverImage` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `developer` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editor` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialPrice` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relaseDate` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "developer" TEXT NOT NULL,
ADD COLUMN     "editor" TEXT NOT NULL,
ADD COLUMN     "initialPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "relaseDate" TEXT NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;
