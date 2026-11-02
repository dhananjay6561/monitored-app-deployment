FROM node:20-alpine

WORKDIR /app

# Copy package files first so the npm install layer is cached
# when only the source code changes
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# The node image ships with a non-root "node" user; don't run as root
USER node

EXPOSE 3000

# busybox wget is included in alpine, so no extra packages are needed
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
