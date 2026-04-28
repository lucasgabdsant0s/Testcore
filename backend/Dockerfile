# backend/Dockerfile
FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /app

# Instalar deps
COPY package*.json ./
RUN npm install

# Copiar código e configs
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

EXPOSE 3000

CMD sh -c "npx prisma generate && npx prisma db push --accept-data-loss && npm run seed && npm run dev"