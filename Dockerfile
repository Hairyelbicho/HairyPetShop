FROM alpine:3.20
LABEL description="No construir desde la raiz. Stack: docker compose -f deploy/docker-compose.yml up -d --build"
CMD ["echo", "Usa: docker compose -f deploy/docker-compose.yml up -d --build"]
