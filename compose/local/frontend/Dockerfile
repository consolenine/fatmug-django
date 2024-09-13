FROM node:22-alpine

WORKDIR /usr/src/app/

COPY ./package.json .

RUN npm install

ENV PATH=./node_modules/.bin/:$PATH

CMD ["npm", "run", "dev"]