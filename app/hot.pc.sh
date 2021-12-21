# Build using vue.config.public.js
# Note: using real path here, it didn't work with relative path
CONF=`realpath vue.config.pc.js`
VUE_CLI_SERVICE_CONFIG_PATH=$CONF yarn hot