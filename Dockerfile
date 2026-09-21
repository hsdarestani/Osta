FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY server.js ./server.js
COPY tailwind.config.js ./tailwind.config.js
COPY src ./src
COPY public ./public
RUN npm run check && npm run build:landing && npm prune --omit=dev
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node","server.js"]
