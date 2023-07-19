import assert from "assert/strict";
import { describe, it } from "node:test";
import { Builder } from "../Builder";

describe('Builder', () => {
  it('should be defined', () => {
    assert.ok(Builder);
  });

  it('should build an disjunction', () => {
    const result = Builder.disjunction('p', 'q');
    assert.equal(result, 'P ∨ Q');
  });
})
