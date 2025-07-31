# Etapa 1: Construcción del frontend
FROM node:20 AS frontend

WORKDIR /app
COPY ./Front ./Front
WORKDIR /app/Front
RUN npm install
RUN npm run build --output-path=../Back/public

# Etapa 2: Backend con Express + frontend compilado
FROM node:20

WORKDIR /app

# Copiamos solo el backend + frontend compilado
COPY ./Back ./Back

WORKDIR /app/Back
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
