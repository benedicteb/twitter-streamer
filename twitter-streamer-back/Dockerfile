FROM node:13-alpine

MAINTAINER Benedicte Emilie Brækken <b@brkn.io>

COPY src /usr/src/app/src
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
COPY tsconfig.json /usr/src/app/

RUN cd /usr/src/app && npm install

WORKDIR /usr/src/app

HEALTHCHECK --interval=5s --timeout=3s \
    CMD curl -f http://localhost:3000/ || exit 1

EXPOSE 3000

CMD [ "npm", "start" ]
