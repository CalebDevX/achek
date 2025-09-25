-- Initial multi-tenant tables for commercial WhatsApp bot
-- Migration: 0001_initial_multitenant

-- Tenants table - each customer organization
CREATE TABLE `tenants` (
  `id` varchar(36) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `domain` varchar(255) UNIQUE,
  `status` varchar(50) DEFAULT 'active',
  `settings` json,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- WhatsApp connections per tenant
CREATE TABLE `whatsapp_connections` (
  `id` varchar(36) PRIMARY KEY,
  `tenant_id` varchar(36) NOT NULL,
  `phone_number_id` varchar(255) NOT NULL,
  `access_token_encrypted` text NOT NULL,
  `verify_token_encrypted` varchar(500) NOT NULL,
  `webhook_url` varchar(500),
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

CREATE INDEX `whatsapp_connections_tenant_id_idx` ON `whatsapp_connections` (`tenant_id`);
CREATE UNIQUE INDEX `whatsapp_connections_tenant_phone_unique` ON `whatsapp_connections` (`tenant_id`, `phone_number_id`);

-- Conversations for each tenant
CREATE TABLE `conversations` (
  `id` varchar(36) PRIMARY KEY,
  `tenant_id` varchar(36) NOT NULL,
  `whatsapp_number` varchar(50) NOT NULL,
  `customer_name` varchar(255),
  `status` varchar(50) DEFAULT 'active',
  `last_message_at` timestamp,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

CREATE INDEX `conversations_tenant_id_idx` ON `conversations` (`tenant_id`);
CREATE INDEX `conversations_created_at_idx` ON `conversations` (`created_at`);
CREATE UNIQUE INDEX `conversations_tenant_whatsapp_unique` ON `conversations` (`tenant_id`, `whatsapp_number`);

-- Messages for conversations
CREATE TABLE `whatsapp_messages` (
  `id` varchar(36) PRIMARY KEY,
  `conversation_id` varchar(36) NOT NULL,
  `tenant_id` varchar(36) NOT NULL,
  `message_id` varchar(255),
  `type` varchar(50) NOT NULL,
  `content` text,
  `direction` varchar(10) NOT NULL,
  `status` varchar(50) DEFAULT 'sent',
  `metadata` json,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

CREATE INDEX `whatsapp_messages_tenant_id_idx` ON `whatsapp_messages` (`tenant_id`);
CREATE INDEX `whatsapp_messages_conversation_id_idx` ON `whatsapp_messages` (`conversation_id`);
CREATE INDEX `whatsapp_messages_created_at_idx` ON `whatsapp_messages` (`created_at`);

-- Transactions tracking per tenant
CREATE TABLE `transactions` (
  `id` varchar(36) PRIMARY KEY,
  `tenant_id` varchar(36) NOT NULL,
  `conversation_id` varchar(36),
  `transaction_id` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  `currency` varchar(10) DEFAULT 'NGN',
  `status` varchar(50) NOT NULL,
  `payment_method` varchar(100),
  `customer_email` varchar(255),
  `metadata` json,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE SET NULL
);

CREATE INDEX `transactions_tenant_id_idx` ON `transactions` (`tenant_id`);
CREATE INDEX `transactions_transaction_id_idx` ON `transactions` (`transaction_id`);
CREATE INDEX `transactions_created_at_idx` ON `transactions` (`created_at`);
CREATE UNIQUE INDEX `transactions_tenant_transaction_unique` ON `transactions` (`tenant_id`, `transaction_id`);

-- Knowledge base for AI responses per tenant
CREATE TABLE `knowledge_base` (
  `id` varchar(36) PRIMARY KEY,
  `tenant_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(100),
  `tags` json,
  `is_active` boolean DEFAULT TRUE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

CREATE INDEX `knowledge_base_tenant_id_idx` ON `knowledge_base` (`tenant_id`);
CREATE INDEX `knowledge_base_category_idx` ON `knowledge_base` (`category`);
CREATE INDEX `knowledge_base_is_active_idx` ON `knowledge_base` (`is_active`);