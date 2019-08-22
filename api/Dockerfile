FROM node

ENV PORT=80
ENV NODE_ENV=production
EXPOSE 80

WORKDIR /home/node/app

COPY src/ src
COPY package.json .

RUN yarn install --production=true

ENTRYPOINT []
CMD ["yarn", "start"]
