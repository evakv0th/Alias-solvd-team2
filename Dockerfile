FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY vocabularies ./vocabularies
COPY tsconfig.json ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]