import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Implication } from 'src/builder/interfaces/operations/implication';
import { reducer } from '../Reducer';
import { builder } from 'src/builder/Builder';
import { Biconditional } from 'src/builder/interfaces/operations/biconditional';
import { Disjunction } from 'src/builder/interfaces/operations/disjunction';

describe('Reducer', () => {
  it('should reduce (P -> Q) to (¬(P) v Q)', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    const result = reducer.reduceFormula(implication);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(builder.buildFormula(result), '(¬(P) ∨ Q)');
  });

  it('should reduce (P <-> Q) to ((¬(P) v Q) ^ (¬(Q) v P))', () => {
    const biconditional: Biconditional = {
      operation: 'Biconditional',
      left: 'P',
      right: 'Q',
    };

    const result = reducer.reduceFormula(biconditional);

    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(builder.buildFormula(result), '((¬(P) ∨ Q) ∧ (¬(Q) ∨ P))');
  });

  it(`should reduce "(P -> (Q -> (P -> Q)) <-> (P v Q))" to 
    "((¬((¬(P) ∨ (¬(Q) ∨ (¬(P) ∨ Q)))) ∨ (P ∨ Q)) ∧ (¬((P ∨ Q)) ∨ (¬(P) ∨ (¬(Q) ∨ (¬(P) ∨ Q)))))"`, () => {
    const firstImplication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    const secondImplication: Implication = {
      operation: 'Implication',
      left: 'Q',
      right: firstImplication,
    };

    const thirdImplication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: secondImplication,
    };

    const disjunction: Disjunction = {
      operation: 'Disjunction',
      left: 'P',
      right: 'Q',
    };

    const conjunction: Biconditional = {
      operation: 'Biconditional',
      left: thirdImplication,
      right: disjunction,
    };

    const result = reducer.reduceFormula(conjunction);
    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(
      builder.buildFormula(result),
      '((¬((¬(P) ∨ (¬(Q) ∨ (¬(P) ∨ Q)))) ∨ (P ∨ Q)) ∧ (¬((P ∨ Q)) ∨ (¬(P) ∨ (¬(Q) ∨ (¬(P) ∨ Q)))))'
    );
  });
});
