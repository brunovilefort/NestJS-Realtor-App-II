/*
  Warnings:

  - The primary key for the `Home` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Home` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `realtor_id` to the `Home` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_id` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyer_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `home_id` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realtor_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Home" DROP CONSTRAINT "Home_pkey",
ADD COLUMN     "realtor_id" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Home_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "home_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "buyer_id" TEXT NOT NULL,
ADD COLUMN     "home_id" INTEGER NOT NULL,
ADD COLUMN     "realtor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_realtor_id_fkey" FOREIGN KEY ("realtor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "Home"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_realtor_id_fkey" FOREIGN KEY ("realtor_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
