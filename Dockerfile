FROM node:14.16.1-alpine3.13 as builder
WORKDIR /person-service/app                       
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:14.16.1-alpine3.13 as production
WORKDIR /person-service/app
COPY --from=builder /person-service/app/ .

EXPOSE 8080

CMD ["node", "dist/main"]