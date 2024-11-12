# FROM nginx:alpine
FROM nginx:mainline
RUN apt-get update && apt-get install -y nginx-module-njs gettext
# copy in the files directly
COPY nginx/nginx.conf /tmp/nginx.conf
COPY nginx/proxy.js /tmp/proxy.js
COPY html/index.html /tmp/index.html
# replace variables in each file with defintions from docker-compose.yml
ARG DNS_RESOLVER
ARG FPJS_GET_RESULT_PATH
ARG FPJS_AGENT_DOWNLOAD_PATH
ARG FPJS_PROXY_SECRET
# Note: We might be able to simplify this using https://github.com/docker-library/docs/tree/master/nginx#using-environment-variables-in-nginx-configuration-new-in-119
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER} ${FPJS_PROXY_SECRET}' < /tmp/proxy.js > /etc/nginx/proxy.js
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER} ${FPJS_PROXY_SECRET}' < /tmp/nginx.conf > /etc/nginx/nginx.conf
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH}' < /tmp/index.html > /usr/share/nginx/html/index.html
