# When going to production, pin Node to a specific version for stability
FROM node:18-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --omit=dev

COPY . .

CMD [ "npm", "run", "start" ]