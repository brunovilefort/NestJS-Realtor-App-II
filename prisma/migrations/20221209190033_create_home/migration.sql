-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESIDENTIAL', 'CONDO');

-- CreateTable
CREATE TABLE "Home" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number_of_bedrooms" INTEGER NOT NULL,
    "number_of_bathrooms" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "listed_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "price" DOUBLE PRECISION NOT NULL,
    "land_size" DOUBLE PRECISION NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);
