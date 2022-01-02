FROM node:buster-slim

RUN mkdir /app
WORKDIR /app

COPY package.json /app
COPY .env /app

RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev
RUN node -v
RUN npm install