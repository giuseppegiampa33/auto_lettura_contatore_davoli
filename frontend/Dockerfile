FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Run in development mode
CMD ["npm", "run", "dev"]
