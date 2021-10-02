FROM node:14.17.5-alpine3.14

WORKDIR /usr/src/app

ENV PORT 80
EXPOSE 80

COPY package.json ./
COPY yarn.lock ./
COPY .env ./

RUN yarn install
RUN yarn build

COPY dist ./dist

CMD [ "yarn", "start:prod" ]