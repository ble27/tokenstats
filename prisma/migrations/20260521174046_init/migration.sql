-- CreateTable
CREATE TABLE "TokenLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "totalCost" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "TokenLog_provider_model_idx" ON "TokenLog"("provider", "model");

-- CreateIndex
CREATE INDEX "TokenLog_timestamp_idx" ON "TokenLog"("timestamp");
