# Estágio 1: prepara os arquivos e as dependências
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src ./src
# A aplicação fornecida é JavaScript, então build empacota src/ em dist/.
RUN npm run build

# Estágio 2: imagem de execução enxuta, sem código-fonte de desenvolvimento
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
