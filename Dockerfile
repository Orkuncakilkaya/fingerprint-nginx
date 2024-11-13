# FROM nginx:alpine
FROM nginx:mainline
RUN apt-get update && apt-get install -y nginx-module-njs gettext
# copy in the files directly
COPY nginx/nginx.conf /tmp/nginx.conf
COPY nginx/fingerprint_proxy.js /tmp/fingerprint_proxy.js
COPY html/index.html /tmp/index.html
COPY nginx/fingerprint_proxy.conf /tmp/fingerprint_proxy.conf
# replace variables in each file with defintions from docker-compose.yml
ARG DNS_RESOLVER=8.8.8.8
ARG FPJS_GET_RESULT_PATH=result
ARG FPJS_AGENT_DOWNLOAD_PATH=agent
ARG FPJS_PROXY_SECRET=secret
ARG FPJS_PUBLIC_API_KEY=public
ARG FPJS_REGION=us
ARG FPJS_CDN_HOST=fpcdn.io
ARG FPJS_API_HOST=api.fpjs.io
ARG FPJS_PLATFORM_IP_HEADER_NAME='$http_do_connecting_ip'
# Note: We might be able to simplify this using https://github.com/docker-library/docs/tree/master/nginx#using-environment-variables-in-nginx-configuration-new-in-119
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER} ${FPJS_PROXY_SECRET} ${FPJS_CDN_HOST} ${FPJS_API_HOST} ${FPJS_PLATFORM_IP_HEADER_NAME}' < /tmp/fingerprint_proxy.js > /etc/nginx/fingerprint_proxy.js
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER} ${FPJS_PROXY_SECRET} ${FPJS_CDN_HOST} ${FPJS_API_HOST} ${FPJS_PLATFORM_IP_HEADER_NAME}' < /tmp/nginx.conf > /etc/nginx/nginx.conf
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${DNS_RESOLVER} ${FPJS_PROXY_SECRET} ${FPJS_CDN_HOST} ${FPJS_API_HOST} ${FPJS_PLATFORM_IP_HEADER_NAME}' < /tmp/fingerprint_proxy.conf > /etc/nginx/fingerprint_proxy.conf
RUN envsubst '${FPJS_GET_RESULT_PATH} ${FPJS_AGENT_DOWNLOAD_PATH} ${FPJS_PUBLIC_API_KEY} ${FPJS_REGION}' < /tmp/index.html > /usr/share/nginx/html/index.html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
