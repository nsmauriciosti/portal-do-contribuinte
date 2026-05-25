FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3006

CMD ["sh", "-c", "npx tsx server.ts & npm run preview"]
