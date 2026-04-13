FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8084
EXPOSE 8085
CMD ["node", "index.js"]
