-- AlterEnum: Add GUEST value (must run outside a transaction on PG < 12;
-- Neon uses PG 16 so this is safe inline, but Prisma marks it accordingly)
ALTER TYPE "UserRole" ADD VALUE 'GUEST';

-- AlterTable: Add phone column
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

-- CreateIndex: Unique constraint on phone
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
