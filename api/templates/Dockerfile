FROM utilitywarehouse/alpine-node:v6

RUN apk add --update nodejs git
RUN npm install -g yarn

RUN mkdir -p /opt
WORKDIR /opt

COPY package.json /opt/
COPY yarn.lock /opt/
RUN yarn install --production

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

COPY . /opt/
CMD [ "node", "index.js" ]