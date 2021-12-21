#!/bin/bash
# git add .
# git commit -m "docker run"
# git pull
# git push
docker pull uhub.service.ucloud.cn/humanrisk/01-games-api:nio.v1.0 && \
docker-compose down -v --remove-orphans && \
docker-compose build && \
docker-compose up -d && \
echo y | docker images prune && \
echo y | docker container prune && \
docker-compose exec vue bash
