FROM node:20
COPY package.json ./
RUN npm install
COPY . .
EXPOSE $PORT
CMD ["npm", "start"]