-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "images" SET NOT NULL,
ALTER COLUMN "images" SET DEFAULT 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGV2ZW50fGVufDB8fDB8fHww',
ALTER COLUMN "images" SET DATA TYPE TEXT;
