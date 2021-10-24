FROM node:14-alpine

WORKDIR /app

ENV PORT 80
EXPOSE 80

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY .env ./
COPY src ./src

RUN yarn install
RUN yarn build

CMD [ "yarn", "start:prod" ]