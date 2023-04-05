FROM ghcr.io/puppeteer/puppeteer:19.8.3 

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN npm ci
COPY . .
CMD [ "node", "index.js" ]