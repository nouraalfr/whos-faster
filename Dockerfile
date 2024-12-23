FROM node:22 

RUN mkdir /app 

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . . 

RUN chmod +x wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "db:3306", "--strict", "--timeout=300", "--", "npm", "run", "start"]