FROM node:12.13.1-alpine
COPY . /opt/casparcg-cliptool
WORKDIR /opt/casparcg-cliptool
EXPOSE 5555/tcp
EXPOSE 5555/udp
CMD ["yarn", "start"]
