FROM node:20-slim
RUN npx playwright install --with-deps chromium

ENV HOME="/home"
WORKDIR /app
COPY . .
RUN npm ci --only=production


EXPOSE 3000

CMD ["npm", "run", "start"]