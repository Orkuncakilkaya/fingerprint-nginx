/// <reference path="../node_modules/njs-types/index.d.ts" />

import querystring from "querystring";

function foo(r) {
  r.log("hello from foo() handler");
  return "foo";
}

function summary(r) {
  var s = "Basic response from summary";
  r.headersOut["Content-Type"] = "text/plain; charset=utf-8";
  return s;
}

function baz(r) {
  r.status = 200;
  r.headersOut.foo = 1234;
  r.headersOut["Content-Type"] = "text/plain; charset=utf-8";
  r.headersOut["Content-Length"] = 15;
  r.sendHeader();
  r.send("nginx");
  r.send("java");
  r.send("script");
  r.finish();
}

async function hello(r) {
  r.return(200, "Hello world!");
}

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

function getAgentURL(r) {
  //   r.headersOut["X-Summary"] = reply.headersOut["Content-Type"];
  const DEFAULT_VERSION = "3";
  const apiKey = r.args["apiKey"];
  const loaderVersion = r.args["loaderVersion"];
  const version = r.args["version"] ?? DEFAULT_VERSION;

  const loaderParam = loaderVersion ? `/loader_v${loaderVersion}.js` : "";
  const agentDownloadUrl = `/v${version}/${apiKey}${loaderParam}`;

  return agentDownloadUrl;
}

export default { foo, summary, baz, hello, getAgentURL, getAgentQueryParams };
