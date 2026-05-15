#!/bin/sh

# Jalankan update schema database
echo "Updating database schema..."
npx drizzle-kit push

# Jalankan aplikasi utama
echo "Starting application..."
node server.js
