FROM node:14-alpine

WORKDIR /usr/app
RUN npm install

CMD npx nodemon server.js
