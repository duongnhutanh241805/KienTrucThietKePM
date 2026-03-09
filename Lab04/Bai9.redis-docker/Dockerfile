FROM redis:latest

# Copy file config vào container
COPY redis.conf /usr/local/etc/redis/redis.conf

# Mở port Redis
EXPOSE 6379

# Chạy redis với file config
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]