FROM node:18
COPY ./dist /nest/dist
COPY ./package-lock.json  /nest/package-lock.json
COPY ./package.json  /nest/package.json
COPY ./.production.env /nest/.production.env
WORKDIR /nest
RUN npm ci
