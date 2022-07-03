# specify the node base image with your desired version node:<version>
FROM node:7
# replace this with your application's default port

COPY dist-server /dist-server/

CMD ["node /dist-server/index.js"]
