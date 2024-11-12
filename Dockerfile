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
ARG DEFAULT_REGION
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER}' < /tmp/proxy.js > /etc/nginx/proxy.js
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER}' < /tmp/nginx.conf > /etc/nginx/nginx.conf
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER} ${DEFAULT_REGION}' < /tmp/index.html > /usr/share/nginx/html/index.html
