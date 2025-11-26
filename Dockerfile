# Dockerfile
FROM n8nio/n8n:latest

USER root

# Directorio para utilidades (servicio Express ligero)
WORKDIR /opt/app
COPY utils/server.js /opt/app/server.js

# Instala dependencias para el servicio utils
RUN corepack enable && yarn init -y && yarn add express

USER node

# n8n usa por defecto el puerto 5678
EXPOSE 5678
# nuestro servicio utils usará el 8080
EXPOSE 8080

# Render ejecutará el comando desde render.yaml
