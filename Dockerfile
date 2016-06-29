FROM meik/nodeflat:6.2.0
MAINTAINER Mike Gregory <meikura@gmail.com>

COPY package.json /usr/src/app

WORKDIR /usr/src/app
RUN npm install

EXPOSE 8080
CMD node app.js
