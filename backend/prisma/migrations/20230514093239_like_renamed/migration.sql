/*
  Warnings:

  - You are about to drop the `GameLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameLikes" DROP CONSTRAINT "GameLikes_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameLikes" DROP CONSTRAINT "GameLikes_targetUserId_fkey";

-- DropForeignKey
ALTER TABLE "GameLikes" DROP CONSTRAINT "GameLikes_userId_fkey";

-- DropTable
DROP TABLE "GameLikes";

-- CreateTable
CREATE TABLE "GameLike" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetUserId" INTEGER NOT NULL,

    CONSTRAINT "GameLike_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GameLike" ADD CONSTRAINT "GameLike_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameLike" ADD CONSTRAINT "GameLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameLike" ADD CONSTRAINT "GameLike_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
