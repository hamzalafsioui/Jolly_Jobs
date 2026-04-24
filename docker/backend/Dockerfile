# =========================================
# Stage 1: Composer dependency installer
# =========================================
FROM composer:2.8 AS composer-deps

WORKDIR /app

COPY backend/composer.json backend/composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --ignore-platform-reqs \
    --no-scripts

# =========================================
# Stage 2: Application image (PHP 8.2-FPM)
# =========================================
FROM php:8.4-fpm-alpine AS app

# System dependencies
RUN apk add --no-cache \
    bash \
    curl \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    postgresql-dev \
    icu-dev \
    libxml2-dev \
    shadow \
    unzip \
    zip

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) \
        bcmath \
        exif \
        gd \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo \
        pdo_pgsql \
        pgsql \
        xml \
        zip

# Redis extension via PECL
RUN apk add --no-cache pcre2-dev ${PHPIZE_DEPS} \
    && pecl channel-update pecl.php.net \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre2-dev ${PHPIZE_DEPS}

# Copy custom PHP config
COPY docker/backend/php.ini /usr/local/etc/php/conf.d/custom.ini

# Create a non-root user that matches common host UIDs
RUN addgroup -g 1000 laravel && adduser -u 1000 -G laravel -s /bin/bash -D laravel

WORKDIR /var/www/html

# Copy vendor from composer stage
COPY --from=composer-deps /app/vendor ./vendor

# Copy application source
COPY --chown=laravel:laravel backend/ .

# Set storage permissions
RUN mkdir -p storage/framework/{cache,sessions,views} \
             storage/logs \
             bootstrap/cache && \
    chown -R laravel:laravel storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Entrypoint
COPY docker/backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER laravel

EXPOSE 9000

ENTRYPOINT ["/entrypoint.sh"]
