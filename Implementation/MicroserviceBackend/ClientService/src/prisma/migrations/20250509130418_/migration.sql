-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "device_code" TEXT NOT NULL,
    "superbuddy_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_device_code_key" ON "Client"("device_code");
