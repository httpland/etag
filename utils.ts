// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Catch error utility. */
export function reason(message: string): (cause: unknown) => never {
  return (cause) => {
    throw Error(message, { cause });
  };
}

export function quote<T extends string>(input: T): `"${T}"`;
export function quote(input: string): string;
export function quote(input: string): string {
  return `"${input}"`;
}
