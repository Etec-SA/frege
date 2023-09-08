import { describe, it } from 'node:test';
import assert from 'node:assert';
import { frege } from 'index';
import { Implication, Negation, Biconditional, Conjunction } from 'types';


describe('frege.parse', () => {
  it('should be defined', () => {
    assert.ok(frege.parse);
  });

  describe('parse.toFormulaString', () => {
    it('should parse Implication of "P" and "Q"', () => {
      const formulaObject: Implication = {
        operation: 'Implication',
        left: 'P',
        right: 'Q',
      };

      const expectedFormulaString = '(P -> Q)';
      const actualFormulaString = frege.parse.toFormulaString(formulaObject);
      assert.equal(actualFormulaString, expectedFormulaString);
    });

    it('should parse an implication of a biconditional and a conjunction', () => {
      const formulaObject: Implication = {
        operation: 'Implication',
        left: { operation: 'Biconditional', left: 'P', right: 'Q' },
        right: { operation: 'Conjunction', left: 'P', right: 'Q' },
      };

      const expectedFormulaString = '((P <-> Q) -> (P ∧ Q))';
      const actualFormulaString = frege.parse.toFormulaString(formulaObject);
      assert.equal(actualFormulaString, expectedFormulaString);
    });

    it('should parse the negation of a conjunction', () => {
      const formulaObject: Negation = {
        operation: 'Negation',
        value: {
          operation: 'Conjunction',
          left: { operation: 'Disjunction', left: 'P', right: 'Q' },
          right: {
            operation: 'Implication',
            left: 'P',
            right: { operation: 'Biconditional', left: 'Q', right: 'P' },
          },
        },
      };

      const expectedFormulaString = '¬(((P ∨ Q) ∧ (P -> (Q <-> P))))';
      const actualFormulaString = frege.parse.toFormulaString(formulaObject);
      assert.equal(actualFormulaString, expectedFormulaString);
    });
  });

  describe('parse.toFormulaObject', () => {
    it('should parse P->Q', () => {
      const formulaString = 'P->Q';
      const expectedFormulaObject: Implication = {
        operation: 'Implication',
        left: 'P',
        right: 'Q',
      };

      const actualFormulaObject =
        frege.parse.toFormulaObject<Implication>(formulaString);

      assert.deepEqual(actualFormulaObject, expectedFormulaObject);
    });

    it('should parse (P<->Q) -> (P ^ Q)', () => {
      const formulaString = '(P<->Q) -> (P ∧ Q)';
      const expectedFormulaObject: Implication = {
        operation: 'Implication',
        left: { operation: 'Biconditional', left: 'P', right: 'Q' },
        right: { operation: 'Conjunction', left: 'P', right: 'Q' },
      };

      const actualFormulaObject = frege.parse.toFormulaObject<{
        operation: 'Implication';
        left: Biconditional;
        right: Conjunction;
      }>(formulaString);

      assert.deepEqual(actualFormulaObject, expectedFormulaObject);
    });

    it('should parse ¬((P v Q) ^ (P->(Q<->P)))', () => {
      const formulaString = '¬( ( P ∨ Q ) ∧ (P->(Q<->P)) )';
      const expectedFormulaObject: Negation = {
        operation: 'Negation',
        value: {
          operation: 'Conjunction',
          left: { operation: 'Disjunction', left: 'P', right: 'Q' },
          right: {
            operation: 'Implication',
            left: 'P',
            right: { operation: 'Biconditional', left: 'Q', right: 'P' },
          },
        },
      };

      const actualFormulaObject = frege.parse.toFormulaObject(formulaString);
      assert.deepEqual(actualFormulaObject, expectedFormulaObject);
    });
  });

  describe('parse.toFormulaString & parse.toFormulaObject', () => {
    it('should do the vice-versa', () => {
      const formulaObject: Negation = {
        operation: 'Negation',
        value: {
          operation: 'Conjunction',
          left: { operation: 'Disjunction', left: 'P', right: 'Q' },
          right: {
            operation: 'Implication',
            left: 'P',
            right: { operation: 'Biconditional', left: 'Q', right: 'P' },
          },
        },
      };

      const formulaString = '¬(((P ∨ Q) ∧ (P -> (Q <-> P))))';
      const parsedFormulaObject = frege.parse.toFormulaString(formulaObject);
      const parsedFormulaString = frege.parse.toFormulaObject(formulaString);

      assert.deepEqual(parsedFormulaString, formulaObject);
      assert.equal(parsedFormulaObject, formulaString);
    });
  });
});
