/// <reference path="../node_modules/njs-types/index.d.ts" />

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

function getAgentURL(r) {
  //   r.headersOut["X-Summary"] = reply.headersOut["Content-Type"];
  const apiKey = r.args["apiKey"];
  const loaderVersion = r.args["loaderVersion"];
  const version = r.args["version"];

  r.log(apiKey);
  r.log(loaderVersion);
  r.log(version);

  const loaderParam = loaderVersion ? `/loader_v${loaderVersion}.js` : "";
  const agentDownloadUrl = `/v${version}/${apiKey}${loaderParam}`;

  r.log(agentDownloadUrl);
  return agentDownloadUrl;
}

export default { foo, summary, baz, hello, getAgentURL };
