# http-etag

ETag middleware for standard `Request` and `Response`.

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

Middleware is exported by default.

Add `etag` field to HTTP Response header. Or, check the etag and return the
appropriate `304` HTTP response.

The ETag is computed from a hash of the `Response` body.

By default, the SHA-1 algorithm of the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
is used. This is because it requires no additional code and is faster.

Calculate ETag:

```ts
import etag from "https://deno.land/x/http_etag@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag();
const response = await middleware(
  new Request("http://localhost"),
  (request) => new Response("ok"),
);

assertEquals(response.headers.get("etag"), "<body:SHA-1>");
```

Check ETag:

```ts
import etag from "https://deno.land/x/http_etag@$VERSION/mod.ts";
import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag();
const response = await middleware(
  new Request("http://localhost", { headers: { "if-none-match": "<etag>" } }),
  (request) => new Response("ok", { headers: { "x-server": "deno" } }),
);

assertEquals(response.status, 304);
assertEquals(await response.text(), "");
assert(response.headers.has("x-server"));
```

## Customize hash algorithm

You can change the hash algorithm from the `digest` filed.

```ts
import etag from "https://deno.land/x/http_etag@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag({
  digest: (data) => crypto.subtle.digest("sha-256", data),
});
const response = await middleware(
  new Request("http://localhost"),
  (request) => new Response("ok"),
);

assertEquals(response.headers.get("etag"), "<body:SHA-256>");
```

The `digest` function must satisfy the following interfaces:

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
