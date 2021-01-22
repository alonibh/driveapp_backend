FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
EXPOSE 3000
EXPOSE 9229
CMD [ "npm", "start" ]
