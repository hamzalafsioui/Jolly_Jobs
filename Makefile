# ========================================
# Makefile — Jolly Jobs Docker shortcuts
# Usage: make <target>
# =========================================

DC      = docker compose
DC_PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml

.PHONY: help up down restart build logs shell \
        migrate fresh seed artisan tinker \
        test prod-build prod-up

# ========================= Default target ===========================
help:
	@echo ""
	@echo "  Jolly Jobs — Docker commands"
	@echo "  ====================================="
	@echo "  make up           Start all containers (detached)"
	@echo "  make down         Stop and remove containers"
	@echo "  make restart      Restart all containers"
	@echo "  make build        Rebuild all images"
	@echo "  make logs         Follow logs from all containers"
	@echo "  make shell        Open bash inside backend container"
	@echo "  make migrate      Run database migrations"
	@echo "  make fresh        migrate:fresh --seed (WIPES DB)"
	@echo "  make seed         Run database seeders"
	@echo "  make tinker       Open Laravel Tinker REPL"
	@echo "  make test         Run PHPUnit tests"
	@echo "  make artisan cmd=<command>   Run any artisan command"
	@echo "  make prod-build   Build production images"
	@echo "  make prod-up      Start production stack"
	@echo ""

# ========================= Dev lifecycle =============================
up:
	$(DC) up -d
	@echo ""
	@echo "  ========= Jolly Jobs is running! ========="
	@echo "  ========= API: http://localhost:8001"
	@echo "  ========= Frontend:   http://localhost:5173"
	@echo "  ========= Reverb WS:  ws://localhost:8080"
	@echo "  ========= Mailpit:    http://localhost:8025"
	@echo "  ========= Postgres:   localhost:5432"
	@echo ""

down:
	$(DC) down

restart:
	$(DC) restart

build:
	$(DC) build --no-cache

logs:
	$(DC) logs -f

# ==================== Shell access =======================
shell:
	$(DC) exec backend bash

shell-db:
	$(DC) exec db psql -U $${DB_USERNAME:-postgres} -d $${DB_DATABASE:-jolly_jobs}

# ==================== Laravel Artisan helpers ==============================
migrate:
	$(DC) exec backend php artisan migrate

fresh:
	@echo "This will WIPE the database and reseed. Press Ctrl+C to cancel..."
	@sleep 3
	$(DC) exec backend php artisan migrate:fresh --seed

seed:
	$(DC) exec backend php artisan db:seed

tinker:
	$(DC) exec backend php artisan tinker

# Run any artisan command: make artisan cmd="route:list"
artisan:
	$(DC) exec backend php artisan $(cmd)

# ================= Tests =========================
test:
	$(DC) exec backend php artisan test

# ================= Cache helpers ==========================
cache-clear:
	$(DC) exec backend php artisan config:clear
	$(DC) exec backend php artisan route:clear
	$(DC) exec backend php artisan view:clear
	$(DC) exec backend php artisan cache:clear

# ===================== Production =======================
prod-build:
	$(DC_PROD) build --no-cache

prod-up:
	$(DC_PROD) up -d
