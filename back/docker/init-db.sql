-- ================================
-- Script de inicialización de PostgreSQL
-- ================================
-- Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear la base de datos si no existe (opcional, ya se crea con POSTGRES_DB)
-- SELECT 'CREATE DATABASE ecommerce_db'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ecommerce_db')\gexec

-- Conectar a la base de datos
\c ecommerce_db;

-- Mensaje de confirmación
SELECT 'Base de datos inicializada correctamente' AS message;
SELECT current_database() AS database_name;
SELECT version() AS postgres_version;
