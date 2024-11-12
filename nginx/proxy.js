/// <reference path="../node_modules/njs-types/ngx_http_js_module.d.ts" />

/**
 * @param {NginxHTTPRequest} r
 * */
function getFilteredCookieHeader(r) {
  if (r.headersIn["Cookie"]) {
    return r.headersIn["Cookie"]
      .split(";")
      .map((raw) => {
        const splitted = raw.split("=");
        const key = splitted[0].trim();
        if (key === "_iidt") {
          return raw;
        }
        return null;
      })
      .filter((t) => t != null)
      .join(";")
      .trim();
  }

  return '';
}

/**
 * @param {NginxHTTPRequest} r
 * */
function getGeneralQueryParams(r, type) {
  const rest = JSON.parse(JSON.stringify(r.args));
  const queryParams = [];

  // Add the custom 'ii' values
  if (rest['ii']) {
    // Ensure 'ii' is an array (if it's a single value, turn it into an array)
    if (!Array.isArray(rest['ii'])) {
      rest['ii'] = [rest['ii']];
    }
    // Add the custom 'ii' value(s)
    rest['ii'].push(`nginx-proxy-integration/0.1/${type}`);
  } else {
    // If no 'ii' exists, start a new array with the custom value
    rest['ii'] = [`nginx-proxy-integration/0.1/${type}`];
  }

  // Loop through all keys and build the query string
  for (const key in rest) {
    if (Object.hasOwnProperty.call(rest, key)) {
      if (Array.isArray(rest[key])) {
        // If the value is an array, append each value as a separate parameter
        rest[key].forEach(value => {
          queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        });
      } else {
        // Otherwise, treat it as a single value
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(rest[key])}`);
      }
    }
  }

  return queryParams;
}

/**
 * @param {NginxHTTPRequest} r
 * */
function getIngressQueryParams(r) {
  return getGeneralQueryParams(r, "ingress").join("&");
}

/**
 * @param {NginxHTTPRequest} r
 * */
function getAgentQueryParams(r) {
  const rest = getGeneralQueryParams(r, "procdn");
  delete rest["apiKey"];
  delete rest["loaderVersion"];
  delete rest["version"];

  return rest.join("&");
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
  getAgentURL,
  getAgentQueryParams,
  getApiBaseFromReqionQueryParam,
  getIngressQueryParams,
  getFilteredCookieHeader,
};
