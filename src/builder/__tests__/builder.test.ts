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

  it('should build a disjunction', () => {
    const result = builder.buildFormula({
      operation: 'Disjunction',
      left: 'P',
      right: 'Q'
    });

    const expected = '(P ∨ Q)';
    assert.equal(result, expected);
  });

  it('should build an implication', () => {
    const result = builder.buildFormula({
      operation: 'Implication',
      left: 'P',
      right: 'Q'
    });

    const expected = '(P -> Q)';
    assert.equal(result, expected);
  });

  it('should build a biconditional', () => {
    const result = builder.buildFormula({
      operation: 'Biconditional',
      left: 'P',
      right: 'Q'
    });

    const expected = '(P ↔ Q)';
    assert.equal(result, expected);
  });


})
