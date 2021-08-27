FROM node:10.13
WORKDIR /usr/src/app
RUN apt update && apt install lsof && apt install uuid-runtime && uuidgen > /etc/machine-id

COPY ["package.json", "./"]
RUN npm install

COPY . .
EXPOSE 80

CMD npm run migration:run && npm run start:dev
