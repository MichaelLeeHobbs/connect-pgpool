FROM node:14.13.1-alpine

WORKDIR /usr/src/app
COPY package* ./
RUN yarn install --force
COPY src src

ENV NPM_CONFIG_LOGLEVEL info
USER node
CMD yarn start
#CMD sleep 900
