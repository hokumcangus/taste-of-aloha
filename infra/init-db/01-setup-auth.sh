#!/bin/bash
# This script runs after the database is initialized
# It modifies pg_hba.conf to allow password authentication for development

# Remove the scram-sha-256 line for all connections
sed -i '/^host all all all scram-sha-256/d' "$PGDATA/pg_hba.conf"

# Add password authentication for all connections (development only!)
echo "host    all             all             0.0.0.0/0               password" >> "$PGDATA/pg_hba.conf"




