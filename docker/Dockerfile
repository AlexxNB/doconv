FROM node:14-alpine

ENV UNO_URL https://raw.githubusercontent.com/dagwieers/unoconv/master/unoconv

RUN apk --no-cache add bash \
            curl \
            util-linux \
            libreoffice \
            ttf-droid-nonlatin \
            ttf-droid \
            ttf-dejavu \
            ttf-freefont \
            ttf-liberation \
        && curl -Ls $UNO_URL -o /usr/local/bin/unoconv \
        && chmod +x /usr/local/bin/unoconv \
        && ln -s /usr/bin/python3 /usr/bin/python \
        && apk del curl \
        && rm -rf /var/cache/apk/*

COPY ./dist /app/dist

WORKDIR /app/dist

EXPOSE 3000

CMD [ "node", "app.js" ]