/*
  Warnings:

  - The primary key for the `CodingQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CodingQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Mcq` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Mcq` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CodingQuestion" DROP CONSTRAINT "CodingQuestion_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CodingQuestion_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Mcq" DROP CONSTRAINT "Mcq_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Mcq_pkey" PRIMARY KEY ("id");
