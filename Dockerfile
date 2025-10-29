# ---------- build stage ----------
FROM node:25-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

RUN npm run prisma:generate
RUN npm run build

# ---------- runtime stage ----------
FROM node:25-alpine AS runner
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

USER node
EXPOSE 3000

CMD ["npm", "start"]