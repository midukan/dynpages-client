# FROM node:14.4.0-alpine3.11
FROM node:18-alpine

RUN apk update && apk upgrade
# RUN apk --no-cache add openssl wget openssh git && apk add ca-certificates && update-ca-certificates
RUN apk add --no-cache bash

# RUN apk update && apk add --no-cache \
#   curl \
#   docker \
#   python3 \
#   py3-pip \
#   gpg \
#   && apk add docker-cli \
#   && pip install docker-compose

RUN npm config set cache /home/node/dynpages-client/.npm-cache --global

USER node

WORKDIR /home/node/dynpages-client
