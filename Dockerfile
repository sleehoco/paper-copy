FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app

# Install curl and unzip for PocketBase download
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Download PocketBase
RUN curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.25.9/pocketbase_0.25.9_linux_amd64.zip -o pb.zip \
    && unzip pb.zip -d /app/pb \
    && rm pb.zip \
    && chmod +x /app/pb/pocketbase

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
COPY start.sh .
RUN chmod +x start.sh

ENV NODE_ENV=production
ENV PORT=3000
ENV PUBLIC_POCKETBASE_URL=http://localhost:8090

EXPOSE 3000 8090

CMD ["./start.sh"]
