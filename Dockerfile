# Etapa 1: Build del frontend Angular
FROM node:20 AS frontend

WORKDIR /app/front
COPY ./Front/ ./
RUN npm install
RUN npm run build --output-path=/app/build

# Etapa 2: Backend con Express + frontend compilado
FROM node:20

WORKDIR /app

# Copiar solo backend
COPY ./Back/ ./Back

# Copiar el build del frontend generado en etapa anterior
COPY --from=frontend /app/front/dist/front/browser/ /app/Back/public/



WORKDIR /app/Back
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

LABEL traefik.enable="true" \
  traefik.http.routers.app.rule="Host(`distinzionejoyas.com`)" \
  traefik.http.routers.app.entrypoints="websecure" \
  traefik.http.routers.app.tls="true" \
  traefik.http.routers.app.tls.certresolver="letsencrypt" \
  traefik.http.middlewares.redirect-to-apex.redirectregex.regex="^https?://www\.distinzionejoyas\.com/(.*)" \
  traefik.http.middlewares.redirect-to-apex.redirectregex.replacement="https://distinzionejoyas.com/$1" \
  traefik.http.middlewares.redirect-to-apex.redirectregex.permanent="true" \
  traefik.http.routers.app-www.rule="Host(`www.distinzionejoyas.com`)" \
  traefik.http.routers.app-www.entrypoints="web" \
  traefik.http.routers.app-www.middlewares="redirect-to-apex" \
  traefik.http.routers.app-www-secure.rule="Host(`www.distinzionejoyas.com`)" \
  traefik.http.routers.app-www-secure.entrypoints="websecure" \
  traefik.http.routers.app-www-secure.tls="true" \
  traefik.http.routers.app-www-secure.tls.certresolver="letsencrypt" \
  traefik.http.routers.app-www-secure.middlewares="redirect-to-apex"
