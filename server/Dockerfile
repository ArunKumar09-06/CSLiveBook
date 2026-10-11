FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package manifests
COPY package.json tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

# Install dependencies
RUN npm install

# Copy source code
COPY shared/ ./shared/
COPY server/ ./server/

# Build shared package then server
RUN npm run build --workspace=@csf/shared
RUN npm run build --workspace=@csf/server

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV SERVER_PORT=4000

COPY package.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/

RUN npm install --omit=dev

COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/server/dist ./server/dist

EXPOSE 4000

CMD ["node", "server/dist/server.js"]
