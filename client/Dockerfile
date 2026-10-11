FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY client/package.json ./client/

RUN npm install

COPY shared/ ./shared/
COPY client/ ./client/

RUN npm run build --workspace=@csf/shared
RUN npm run build --workspace=@csf/client

FROM nginx:alpine AS runner

COPY --from=builder /app/client/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
