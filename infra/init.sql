-- Database initialization script for ApaceTicket
-- This script runs automatically when PostgreSQL container starts

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE apaceticket'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'apaceticket');

-- Connect to apaceticket database
\c apaceticket;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";