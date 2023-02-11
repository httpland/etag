# http-etag

HTTP ETag utilities for `Request` and `Response`.

## Usage

Add `etag` field to HTTP Response header. Or, check the etag and return the
appropriate `304` HTTP response.

The ETag is computed from a hash of the `Response` body.

For the sake of immutability, we guarantee that the argument will not be
modified.

```ts
import { withEtag } from "https://deno.land/x/http_etag@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const taggedResponse = await withEtag(
  new Request("http://localhost"),
  new Response("ok"),
);

assertEquals(taggedResponse.headers.get("etag"), "<body:FNV32:hash>");
```

## Supported algorithms

You can change the algorithm from the `algorithm` filed.

```ts
import { withEtag } from "https://deno.land/x/http_etag@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const taggedResponse = await withEtag(
  new Request("http://localhost"),
  new Response("ok"),
  { algorithm: "SHA-1" },
);

assertEquals(taggedResponse.headers.get("etag"), "<body:SHA-1:hash>");
```

The following algorithms are supported built-in.

- BLAKE2B
- BLAKE2B-256
- BLAKE2B-384
- BLAKE2S
- BLAKE3
- KECCAK-224
- KECCAK-256
- KECCAK-384
- KECCAK-512
- SHA-1
- SHA-224
- SHA-256
- SHA-384
- SHA-512
- SHA3-224
- SHA3-256
- SHA3-384
- SHA3-512
- SHAKE128
- SHAKE256
- TIGER
- RIPEMD-160
- MD4
- MD5
- FNV32(Default)
- FNV32A
- FNV64
- FNV64A

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
