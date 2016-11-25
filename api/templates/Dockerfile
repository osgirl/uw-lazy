FROM registry.uw.systems/base_images/uw-alpine-node:v7

RUN mkdir -p /opt
WORKDIR /opt

ADD . /opt/

EXPOSE 3000

CMD ["node", "index.js"]
