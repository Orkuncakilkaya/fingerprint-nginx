/// <reference path="../node_modules/njs-types/ngx_http_js_module.d.ts" />
import querystring from "querystring";

/**
 * @param {NginxHTTPRequest} r
 * */
function getAgentQueryParams(r) {
  const rest = JSON.parse(JSON.stringify(r.args));
  delete rest["apiKey"];
  delete rest["loaderVersion"];
  delete rest["version"];

  const queryParams = { ii: "nginx-proxy-integration/0.1/procdn" };
  for (const key in rest) {
    queryParams[key] = rest[key];
  }
  return querystring.stringify(queryParams);
}

/**
 * @param {NginxHTTPRequest} r
 */
function getAgentURL(r) {
  const DEFAULT_VERSION = "3";
  const apiKey = r.args["apiKey"];
  const loaderVersion = r.args["loaderVersion"];
  const version = r.args["version"] ?? DEFAULT_VERSION;

  const loaderParam = loaderVersion ? `/loader_v${loaderVersion}.js` : "";
  const agentDownloadUrl = `/v${version}/${apiKey}${loaderParam}`;

  return agentDownloadUrl;
}

async function identification(r) {
  r.return(200, "Identification Hello!");
}

/**
 * Uses `region` query param to return the correct API base URL
 * @param {NginxHTTPRequest} r
 * @returns {string}
 */
function getApiBaseFromReqionQueryParam(r) {
  const region = r.args["region"];
  r.log(`Provided 'region' query param is '${region}'`);

  // Default to US API
  let result = "api.fpjs.io";
  if (region === "eu") {
    result = "eu.api.fpjs.io";
  }
  if (region === "ap") {
    result = "ap.api.fpjs.io";
  }
  r.log(`Returning ${result}`);
  return result;
}

export default {
  identification,
  getAgentURL,
  getAgentQueryParams,
  getApiBaseFromReqionQueryParam,
};
