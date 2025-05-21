-- CreateTable
CREATE TABLE "Network" (
    "client_id" TEXT NOT NULL,
    "buddy_id" TEXT NOT NULL,
    "layer" INTEGER NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("client_id","buddy_id")
);
