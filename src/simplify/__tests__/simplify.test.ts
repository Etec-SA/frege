import assert from "node:assert";
import { describe, it } from "node:test";
import { Implication } from "src/builder/interfaces/operations/implication";
import { simplify } from "../Simplify";
import { builder } from "src/builder/Builder";

describe('Simplify', () => {
  it('should simplify (P -> Q) to (¬P v Q)', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q'
    }

    const result = simplify.implication(implication);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(builder.buildFormula(result), '(¬(P) ∨ Q)')
  });
});
