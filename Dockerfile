FROM uhub.service.ucloud.cn/humanrisk/vue.js as build-stage

COPY /app /app

WORKDIR /app

RUN yarn add @vue/cli \
    && yarn add cross-env \
    && yarn add joi \
    && yarn add @sideway/address \
    && yarn global add @vue/cli-shared-utils@^4.5.14 \
    && yarn install \
    && yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /var/www
COPY --from=uhub.service.ucloud.cn/humanrisk/01-games-backend /var/www/backend /var/www/backend
COPY /.docker/conf/nginx/nginx.conf /etc/nginx/nginx.conf
COPY /.docker/conf/nginx/conf.d /etc/nginx/conf.d
RUN sed -i 's/app\/dist/var\/www/g' /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]