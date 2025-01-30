FROM node:20-slim

ENV HOME="/home"
WORKDIR /app
COPY . .
RUN npm install
RUN npm ci && npx playwright install --with-deps chromium


EXPOSE 3000

CMD ["npm", "run", "heroku:start"]