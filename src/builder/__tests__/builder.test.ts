import assert from "assert/strict";
import { describe, it } from "node:test";
import { builder } from "../Builder";

describe('Builder', () => {
  it('should be defined', () => {
    assert.ok(builder);
  });

  it('should build a conjunction', () => {
    const result = builder.buildFormula({
      operation: 'Conjunction',
      left: 'P',
      right: 'Q'
    });

    const expected = '(P ∧ Q)'
    assert.equal(result, expected);
  });

})
