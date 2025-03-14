FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./src/data ./data

RUN npm run build

EXPOSE 8080

CMD [ "node", "build/app.js" ]
