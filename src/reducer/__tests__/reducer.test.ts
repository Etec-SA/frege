import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Reducer } from '../Reducer';
import { Builder } from 'builder/Builder';
import {
  Implication,
  Biconditional,
  Disjunction,
  Conjunction,
  Negation,
} from 'types';

describe('Reducer', () => {
  it('should reduce (P -> Q) to (¬(P) v Q)', () => {
    const implication: Implication = {
      operation: 'Implication',
      left: 'P',
      right: 'Q',
    };

    const result = Reducer.implication(implication);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(Builder.buildFormula(result), '(¬(P) ∨ Q)');
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

    const result = Reducer.implication(implication);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(Builder.buildFormula(result), '(¬(P) ∨ (¬(Q) ∨ P))');
  });

  it('should reduce (P <-> Q) to ((¬(P) v Q) ^ (¬(Q) v P))', () => {
    const biconditional: Biconditional = {
      operation: 'Biconditional',
      left: 'P',
      right: 'Q',
    };

    const result = Reducer.biconditional(biconditional);

    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(Builder.buildFormula(result), '((¬(P) ∨ Q) ∧ (¬(Q) ∨ P))');
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

    const result = Reducer.biconditional(conjunction);
    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(
      Builder.buildFormula(result),
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

    const result = Reducer.conjunction(conjunction);
    assert.ok(result);
    assert.equal(result.operation, 'Conjunction');
    assert.equal(Builder.buildFormula(result), '((¬(P) ∨ Q) ∧ (¬(P) ∨ Q))');
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

    const result = Reducer.disjunction(disjunction);
    assert.ok(result);
    assert.equal(result.operation, 'Disjunction');
    assert.equal(Builder.buildFormula(result), '((¬(P) ∨ Q) ∨ (¬(P) ∨ Q))');
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

    const result = Reducer.negation(negation);
    assert.ok(result);
    assert.equal(result.operation, 'Negation');
    assert.equal(Builder.buildFormula(result), '¬((¬(P) ∨ Q))');
  });
});
