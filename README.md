# http-etag

HTTP `ETag` middleware for standard `Request` and `Response`.

## What

Middleware for ETag header field.

Calculate the hash value from the response body and fill in the `ETag` header
field.

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

Middleware factory is exported by default.

By default, the SHA-1 algorithm of the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
is used. This is because it requires no additional code and is faster.

```ts
import etag from "https://deno.land/x/http_etag@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = etag();
const response = await middleware(
  new Request("http://localhost"),
  (request) => new Response("ok"),
);

assertEquals(response.headers.get("etag"), `"<body:SHA-1>"`);
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

assertEquals(response.headers.get("etag"), `"<body:SHA-256>"`);
```

The `digest` function must satisfy the following interfaces:

```ts
interface Digest {
  (data: ArrayBuffer): ArrayBuffer | Promise<ArrayBuffer>;
}
```

## Effects

Middleware will effect following:

- HTTP Headers
  - `ETag`

## Conditions

For safety, middleware is executed only if the following conditions are met:

- The body exists
- The body is readable
- The `ETag` header does not exist

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
