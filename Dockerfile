FROM node:18.17.0-alpine

# Install Chromium (headless Chrome)
RUN apk add --no-cache chromium

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD npm run start