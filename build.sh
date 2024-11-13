#!/bin/bash

# Create build directory if it doesn't exist
mkdir -p build

# Export all variables from .env file
export $(cat .env | grep -v '^#' | xargs)

# Define the list of variables to be replaced
VARIABLES='${FPJS_AGENT_DOWNLOAD_PATH} ${FPJS_GET_RESULT_PATH} ${DNS_RESOLVER} ${FPJS_PROXY_SECRET} ${FPJS_CDN_HOST} ${FPJS_API_HOST} ${FPJS_PLATFORM_IP_HEADER_NAME} ${FPJS_PUBLIC_API_KEY}'

# Use envsubst to replace variables and save to build directory
envsubst "$VARIABLES" < nginx/fingerprint_proxy.conf > build/fingerprint_proxy.conf
envsubst "$VARIABLES" < nginx/fingerprint_proxy.js > build/fingerprint_proxy.js
envsubst "$VARIABLES" < nginx/nginx.conf > build/nginx.conf
envsubst "$VARIABLES" < html/index.html > build/index.html

echo "Variable placeholders in configuration files have been replaced with environment variables."
echo "Files have been saved to build/ folder."