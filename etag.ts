// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { toHashString } from "./deps.ts";
import { FailBy, Field } from "./constants.ts";
import { ifNoneMatch, reason } from "./utils.ts";

export interface Options {
  /** Function to calculate hash values. The data is passed the actual response body value.
   * @default {@link digestSHA1}
   */
  readonly digest?: Digest;
}

/** Function to calculate hash values. */
export interface Digest {
  (data: ArrayBuffer): ArrayBuffer | Promise<ArrayBuffer>;
}

const digestSHA1: Digest = (data: ArrayBuffer) =>
  crypto.subtle.digest("sha-1", data);

/** Add `etag` field to HTTP Response header. Or, check the etag and return the
 * appropriate `304` HTTP response.
 * @throws {Error} If fail to calculate hash.
 *
 * @example
 * ```ts
 * import { withEtag } from "https://deno.land/x/http_etag@$VERSION/etag.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const response = await withEtag(
 *   new Request("http://localhost"),
 *   new Response("ok"),
 * );
 * assertEquals(response.headers.get("etag"), "<body:SHA1>");
```
 */
export async function withEtag(
  request: Request,
  response: Response,
  options?: Options,
): Promise<Response> {
  if (response.bodyUsed) return response;

  const { digest = digestSHA1 } = options ?? {};

  const etagValue = response.headers.get(Field.Etag);
  const etag = etagValue ?? await response
    .clone()
    .arrayBuffer()
    .catch(reason(FailBy.Fetch))
    .then(digest)
    .catch(reason(FailBy.CalcHash))
    .then(toHashString)
    .catch(reason(FailBy.CalcHashString));
  const res = response.clone();

  res.headers.set(Field.Etag, etag);

  const ifNoneMatchValue = request.headers.get(Field.IfNoneMatch);

  if (!ifNoneMatchValue || !ifNoneMatch(ifNoneMatchValue, etag)) return res;

  res.headers.delete(Field.ContentLength);
  res.headers.delete(Field.ContentType);

  const newResponse = new Response(null, { ...res, status: 304 });

  return newResponse;
}
