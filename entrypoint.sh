#!/bin/sh

# Jalankan update schema database
echo "Updating database schema..."
node db/migrate.mjs

# Jalankan aplikasi utama
echo "Starting application..."
node server.js
