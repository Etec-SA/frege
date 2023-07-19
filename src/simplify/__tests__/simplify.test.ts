import assert from "node:assert";
import { describe, it } from "node:test";
import { Implication } from "src/builder/interfaces/operations/implication";
import { simplify } from "../Simplify";
import { builder } from "src/builder/Builder";
import { Biconditional } from "src/builder/interfaces/operations/biconditional";

describe('Simplify', () => {
  it('should simplify (P -> Q) to (¬(P) v Q)', () => {
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

  it('should simplify (P <-> Q) to (P -> Q) ^ (Q -> P)', () => {
    const biconditional: Biconditional = {
      operation: 'Biconditional',
      left: 'P',
      right: 'Q'
    }

    const result = simplify.biconditional(biconditional);
    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(builder.buildFormula(result), '((P -> Q) ∧ (Q -> P))')
  });

});
