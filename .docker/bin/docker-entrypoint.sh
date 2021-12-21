#!/bin/sh
# vim:sw=4:ts=4:et

set -e

if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
    exec 3>&1
else
    exec 3>/dev/null
fi

/usr/bin/envsubst '$POINTS_API_URI;$GAMES_API_URI' < '/etc/nginx/template/default.conf' > /etc/nginx/conf.d/default.conf

exec "$@"