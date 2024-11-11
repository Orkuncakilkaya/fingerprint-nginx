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

function hello(r) {
  r.return(200, "Hello world!");
}

export default { foo, summary, baz, hello };
