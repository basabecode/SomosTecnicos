-- CreateTable: OrderSequence para generación atómica de números de orden
CREATE TABLE "order_sequences" (
    "year" INTEGER NOT NULL,
    "last_number" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_sequences_pkey" PRIMARY KEY ("year")
);

-- CreateTable: IdempotentRequest para prevenir procesamiento duplicado
CREATE TABLE "idempotent_requests" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "status_code" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotent_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "idempotent_requests_key_key" ON "idempotent_requests"("key");

-- CreateIndex
CREATE INDEX "idempotent_requests_expires_at_idx" ON "idempotent_requests"("expires_at");

-- CreateIndex
CREATE INDEX "idempotent_requests_created_at_idx" ON "idempotent_requests"("created_at");
