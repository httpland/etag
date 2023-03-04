// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { Middleware } from "./deps.ts";
import { type Options, withEtag } from "./transform.ts";
export { type Digest, type Options } from "./transform.ts";
export { type Middleware } from "./deps.ts";

/** Create ETag middleware.
 *
 * @example
 * ```ts
 * import etag from "https://deno.land/x/http_etag@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const middleware = etag();
 * const response = await middleware(
 *   new Request("http://localhost"),
 *   (request) => new Response("ok"),
 * );
 *
 * assertEquals(response.headers.get("etag"), `"<body:SHA-1>"`);
 * ```
 */
export default function etag(options?: Options): Middleware {
  return async (request, next) => {
    const response = await next(request);

    return withEtag(response, options);
  };
}
