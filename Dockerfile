FROM node:15-alpine

COPY ./dist /app

WORKDIR /app

EXPOSE 8000

CMD [ "node", "app.js" ]