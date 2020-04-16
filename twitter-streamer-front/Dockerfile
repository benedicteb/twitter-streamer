# Stage 1 - build
FROM node:13-alpine as build-dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY tsconfig.json ./
COPY src/ ./src
COPY public/ ./public
ARG BACKEND_HOST
ARG MAX_TWEETS_TO_LIST
RUN echo "{\"backendHost\": \"$BACKEND_HOST\", \"maxTweetsToList\": $MAX_TWEETS_TO_LIST}" > ./src/config.json
RUN npm run build

# Stage 2 - run
FROM nginx:1.17-alpine
COPY --from=build-dependencies /usr/src/app/build /usr/share/nginx/html
RUN apt update && apt install -y curl

MAINTAINER Benedicte Emilie Brækken <b@brkn.io>

HEALTHCHECK --interval=5s --timeout=3s \
    CMD curl -f http://localhost:80/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
