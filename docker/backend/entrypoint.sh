#!/bin/bash
set -e

# ─── Colours ───────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}[Jolly Jobs] Starting Laravel backend...${NC}"

# ─── Wait for PostgreSQL ──────────────────────────────
echo -e "${YELLOW}[Jolly Jobs] Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}...${NC}"
until php -r "
    \$pdo = new PDO(
        'pgsql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}',
        '${DB_USERNAME}',
        '${DB_PASSWORD}'
    );
" ; do
    echo "  PostgreSQL not ready yet — retrying in 2s..."
    sleep 2
done
echo -e "${GREEN}[Jolly Jobs] PostgreSQL is ready.${NC}"

# ─── Cache clear first (always safe) ─────────────────
php artisan config:clear
php artisan route:clear
php artisan view:clear

# ─── Run migrations ──────────────────────────────
echo -e "${YELLOW}[Jolly Jobs] Running migrations...${NC}"
php artisan migrate --force
echo -e "${GREEN}[Jolly Jobs] Migrations done.${NC}"

# ─── Storage link ────────────────────────────────
php artisan storage:link --force 2>/dev/null || true

# ─── Cache (only in production) ──────────────────
if [ "${APP_ENV}" = "production" ]; then
    echo -e "${YELLOW}[Jolly Jobs] Caching config/routes for production...${NC}"
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# ─── Start Application ───────────────────────────
if [ $# -gt 0 ]; then
    echo -e "${GREEN}[Jolly Jobs] Executing custom command: $@${NC}"
    exec "$@"
else
    echo -e "${GREEN}[Jolly Jobs] Starting PHP-FPM...${NC}"
    exec php-fpm
fi
