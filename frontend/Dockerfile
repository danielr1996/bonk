FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
EXPOSE 80
COPY ./container/config.sh .
COPY .env .
COPY --from=builder /app/build .
RUN chmod +x config.sh
CMD ["/bin/bash","-c","/usr/share/nginx/html/config.sh config.js && nginx -g \"daemon off;\""]
