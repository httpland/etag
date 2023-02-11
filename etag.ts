// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { createHash, type DigestAlgorithm, toHashString } from "./deps.ts";
import { FailBy, Field } from "./constants.ts";
import { ifNoneMatch, reason } from "./utils.ts";

export interface Options {
  /**
   * @default FNV32
   */
  readonly algorithm?: DigestAlgorithm;
}

const DEFAULT_ALGORITHM = "FNV32";

/** Add `etag` field to HTTP Response header. Or, check the etag and return the
 * appropriate `304` HTTP response.
 * @throws {Error} If fail to calculate hash.
 *
 * @example
 * ```ts
 * import { withEtag } from "https://deno.land/x/http_etag@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const taggedResponse = await withEtag(
 *   new Request("http://localhost"),
 *   new Response("ok"),
 * );
 * assertEquals(taggedResponse.headers.get("etag"), "<body:FNV32:hash>");
```
 */
export async function withEtag(
  request: Request,
  response: Response,
  options?: Options,
): Promise<Response> {
  const etagValue = response.headers.get(Field.Etag);

  if (!etagValue && response.bodyUsed) return response;

  const etag = etagValue ?? await response
    .clone()
    .arrayBuffer()
    .catch(reason(FailBy.Fetch))
    .then(toHash)
    .catch(reason(FailBy.CalcHash))
    .then(toHashString)
    .catch(reason(FailBy.CalcHashString));
  const res = response.clone();

  res.headers.set(Field.Etag, etag);

  const ifNoneMatchValue = request.headers.get(Field.IfNoneMatch);

  if (!ifNoneMatchValue || !ifNoneMatch(ifNoneMatchValue, etag)) return res;

  res.headers.delete(Field.ContentLength);

  const newResponse = new Response(null, { ...res, status: 304 });

  return newResponse;

  function toHash(data: Parameters<CreateHash>[1]): ReturnType<CreateHash> {
    return createHash(options?.algorithm ?? DEFAULT_ALGORITHM, data);
  }
}

type CreateHash = typeof createHash;
