FROM node

ENV PORT=80
ENV NODE_ENV=production
EXPOSE 80
EXPOSE 24231

WORKDIR /home/node/app

COPY src/ src
COPY package.json .

RUN yarn install --production=true

ENTRYPOINT []
CMD ["yarn", "start"]
