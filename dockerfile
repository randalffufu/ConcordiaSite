FROM nginx:alpine
COPY vitrine/ /usr/share/nginx/html/
EXPOSE 80