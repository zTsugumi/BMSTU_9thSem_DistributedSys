-- file: 10-create-user-and-db.sql
SELECT 'CREATE DATABASE services' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'services');
CREATE ROLE program WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE services TO program;
ALTER ROLE program WITH LOGIN;