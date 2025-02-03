FROM node:20-slim
RUN npx playwright install --with-deps chromium

ENV HOME="/home"
WORKDIR /app
COPY ./cloudrun .
RUN npm run build
RUN npm ci --only=production


EXPOSE 8080

CMD ["npm", "run", "start"]