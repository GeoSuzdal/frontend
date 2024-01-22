# Stage 1: Build
FROM node:20.9 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_GEOSERVER_ENDPOINT="http://localhost:8080"
ENV VITE_GEODATA_ENDPOINT="http://localhost:8000"

RUN npm run build

# Stage 2: Run
FROM nginx:alpine
ENV NGINX_PORT=8888

RUN echo "user nginx; worker_processes auto;                                            \
                                                                                        \
          error_log /var/log/nginx/error.log warn; pid                                  \
          /var/run/nginx.pid;                                                           \
                                                                                        \
          events { worker_connections 1024; }                                           \
                                                                                        \
          http { include /etc/nginx/mime.types; default_type application/octet-stream;  \
                                                                                        \
          log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" ' \
                            '\$status \$body_bytes_sent "\$http_referer" '              \
                            '"\$http_user_agent" "\$http_x_forwarded_for"';             \
                                                                                        \
          access_log  /var/log/nginx/access.log  main;                                  \
                                                                                        \
          sendfile        on;                                                           \
          keepalive_timeout  65;                                                        \
                                                                                        \
                                                                                        \
              server {                                                                  \
              location / {                                                              \
                  root   /usr/share/nginx/html;                                         \
                  index  index.html index.htm;                                          \
                  try_files \$uri \$uri/ /index.html;                                   \
              }                                                                         \
                                                                                        \
              location ~ ^/$ {                                                          \
                  rewrite  ^.*$  /index.html  last;                                     \
              }                                                                         \
              listen       $NGINX_PORT;                                                          \
              server_name  localhost;                                                   \
              error_page   500 502 503 504  /50x.html;                                  \
              location = /50x.html {                                                    \
                  root   /usr/share/nginx/html;                                         \
              }                                                                         \
          }                                                                             \
          }"                                                                            \
          > /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE $NGINX_PORT

CMD ["nginx", "-g", "daemon off;"]