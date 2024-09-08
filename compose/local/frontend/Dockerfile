FROM node:22-alpine

WORKDIR /usr/src/app/

COPY ./package.json .

RUN npm install && npm cache clean --force

ENV PATH=./node_modules/.bin/:$PATH

CMD ["npm", "run", "dev"]