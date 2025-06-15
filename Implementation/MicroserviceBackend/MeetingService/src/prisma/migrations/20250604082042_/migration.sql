-- CreateTable
CREATE TABLE "Meeting" (
    "id" UUID NOT NULL,
    "clientId" INTEGER NOT NULL,
    "buddyId" INTEGER,
    "request" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "match" TIMESTAMP(3),
    "notification" VARCHAR(500),

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);
