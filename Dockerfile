FROM node:6.2.0
MAINTAINER Mike Gregory <meikura@gmail.com>

RUN rm -fr /usr/src/app
COPY . /usr/src/app

WORKDIR /usr/src/app
RUN npm install

EXPOSE 8080
CMD node app.js

