FROM node:20.18.0-alpine

WORKDIR /wanderlust

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]
