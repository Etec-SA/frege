import assert from 'node:assert';
import { describe, it } from 'node:test';
import { reducer } from '../Reducer';
import { builder } from 'src/builder/Builder';
import { Negation } from 'src/types/operations/unary-operation';
import { Biconditional, Implication, Conjunction, Disjunction } from 'src/types/operations/binary-operations';

describe('Reducer', () => {
  it('should reduce (P -> Q) to (¬(P) v Q)', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    const result = reducer.implication(implication);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(builder.buildFormula(result), '(¬(P) ∨ Q)');
  });

  it('should reduce P -> (Q -> P) to (¬(P) v (¬(Q) v P))', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: {
        operation: 'Implication',
        left: 'Q',
        right: 'P',
      },
    };

    const result = reducer.implication(implication);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(builder.buildFormula(result), '(¬(P) ∨ (¬(Q) ∨ P))');
  });

  it('should reduce (P <-> Q) to ((¬(P) v Q) ^ (¬(Q) v P))', () => {
    const biconditional: Biconditional = {
      operation: 'Biconditional',
      left: 'P',
      right: 'Q',
    };

    const result = reducer.biconditional(biconditional);

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

    const result = reducer.biconditional(conjunction);
    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(
      builder.buildFormula(result),
      '((¬((¬(P) ∨ (¬(Q) ∨ (¬(P) ∨ Q)))) ∨ (P ∨ Q)) ∧ (¬((P ∨ Q)) ∨ (¬(P) ∨ (¬(Q) ∨ (¬(P) ∨ Q)))))'
    );
  });

  it('should reduce (P -> Q) ^ (P -> Q) to ((¬(P) v Q) ^ (¬(P) v Q))', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    const conjunction: Conjunction = {
      operation: 'Conjunction',
      left: implication,
      right: implication,
    };

    const result = reducer.conjunction(conjunction);
    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(builder.buildFormula(result), '((¬(P) ∨ Q) ∧ (¬(P) ∨ Q))');
  });

  it('should reduce (P -> Q) v (P -> Q) to ((¬(P) ∨ Q) ∨ (¬(P) ∨ Q))', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    const disjunction: Disjunction = {
      operation: 'Disjunction',
      left: implication,
      right: implication,
    };

    const result = reducer.disjunction(disjunction);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(builder.buildFormula(result), '((¬(P) ∨ Q) ∨ (¬(P) ∨ Q))');
  });

  it('should reduce ¬(P -> Q) to ¬((¬(P) ∨ Q))', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    const negation: Negation = {
      operation: 'Negation',
      value: implication,
    };

    const result = reducer.negation(negation);
    assert.ok(result);
    assert.equal(result.operation, 'Negation');
    assert.equal(builder.buildFormula(result), '¬((¬(P) ∨ Q))');
  });
});
