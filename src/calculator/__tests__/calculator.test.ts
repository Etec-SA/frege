import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Calculator } from '../Calculator';
import {
  Implication,
  Conjunction,
  Disjunction,
  Biconditional,
  Negation,
} from 'types';

describe('calculator', () => {
  it('should be defined', () => {
    assert.ok(Calculator, 'calculator class is defined.');
  });

  describe('evaluate', () => {
    it('should be defined', () => {
      assert.ok(Calculator.evaluate, 'evaluate method is defined');
    });

    it('should evaluate correctly an implication', () => {
      const operation: Implication = {
        operation: 'Implication',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, false);
      assert.equal(case4, true);
    });

    it('should evaluate correctly a conjunction', () => {
      const operation: Conjunction = {
        operation: 'Conjunction',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, false);
      assert.equal(case3, false);
      assert.equal(case4, false);
    });

    it('should evaluate correctly a disjunction', () => {
      const operation: Disjunction = {
        operation: 'Disjunction',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, false);
    });

    it('should evaluate correctly a biconditional', () => {
      const operation: Biconditional = {
        operation: 'Biconditional',
        left: 'A',
        right: 'B',
      };
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, false);
      assert.equal(case3, false);
      assert.equal(case4, true);
    });

    it('should evaluate correctly a negation', () => {
      const operation: Negation = { operation: 'Negation', value: 'A' };
      const case1 = Calculator.evaluate(operation, { A: true });
      const case2 = Calculator.evaluate(operation, { A: false });

      assert.equal(case1, false);
      assert.equal(case2, true);
    });

    it('should evaluate A->(B->A)', () => {
      const operation = 'A->(B->A)';
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    });

    it('should evaluate ¬(¬(A ∧ ¬B) ∧ ¬(A ∧ ¬B))', () => {
      const operation = '¬A ∨ (¬B ∨ A)';
      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    });

    it('should evaluate ¬(¬ A ∧ ¬(B->A))', () => {
      const operation = '¬(A ∧ ¬¬(B ∧ ¬A))';

      const case1 = Calculator.evaluate(operation, { A: true, B: true });
      const case2 = Calculator.evaluate(operation, { A: false, B: true });
      const case3 = Calculator.evaluate(operation, { A: true, B: false });
      const case4 = Calculator.evaluate(operation, { A: false, B: false });

      assert.equal(case1, true);
      assert.equal(case2, true);
      assert.equal(case3, true);
      assert.equal(case4, true);
    });
  });

  describe('generateTruthTable', () => {
    it('should generate a truth table for ¬P', () => {
      const output = Calculator.generateTruthTable('¬P');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['P', '¬P']);
      assert.deepStrictEqual(truthCombinations, [[false], [true]]);
      assert.deepStrictEqual(truthValues, [true, false]);
    });

    it('should generate a truth table for P -> Q', () => {
      const output = Calculator.generateTruthTable('P -> Q');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['P', 'Q', 'P -> Q']);
      assert.deepStrictEqual(truthCombinations, [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ]);
      assert.deepStrictEqual(truthValues, [true, true, false, true]);
    });

    it('should generate a truth table for P <-> Q', () => {
      const output = Calculator.generateTruthTable('P <-> Q');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['P', 'Q', 'P <-> Q']);
      assert.deepStrictEqual(truthCombinations, [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ]);
      assert.deepStrictEqual(truthValues, [true, false, false, true]);
    });

    it('should generate a truth table for P ∧ Q', () => {
      const output = Calculator.generateTruthTable('P ∧ Q');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['P', 'Q', 'P ∧ Q']);
      assert.deepStrictEqual(truthCombinations, [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ]);
      assert.deepStrictEqual(truthValues, [false, false, false, true]);
    });

    it('should generate a truth table for P ∨ Q', () => {
      const output = Calculator.generateTruthTable('P ∨ Q');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['P', 'Q', 'P ∨ Q']);
      assert.deepStrictEqual(truthCombinations, [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ]);
      assert.deepStrictEqual(truthValues, [false, true, true, true]);
    });

    it('should generate a truth table for (A ∨ B) -> ¬(¬C ∧ D)', () => {
      const output = Calculator.generateTruthTable('(A ∨ B) -> ¬(¬C ∧ D)');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, [
        'A',
        'B',
        'C',
        'D',
        '(A ∨ B) -> ¬(¬C ∧ D)',
      ]);
      assert.deepStrictEqual(truthCombinations, [
        [false, false, false, false],
        [false, false, false, true],
        [false, false, true, false],
        [false, false, true, true],
        [false, true, false, false],
        [false, true, false, true],
        [false, true, true, false],
        [false, true, true, true],
        [true, false, false, false],
        [true, false, false, true],
        [true, false, true, false],
        [true, false, true, true],
        [true, true, false, false],
        [true, true, false, true],
        [true, true, true, false],
        [true, true, true, true],
      ]);
      assert.deepStrictEqual(truthValues, [
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
      ]);
    });

    it('should generate a truth table for ¬(A ∧ B)', () => {
      const output = Calculator.generateTruthTable('¬(A ∧ B)');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['A', 'B', '¬(A ∧ B)']);
      assert.deepStrictEqual(truthCombinations, [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ]);
      assert.deepStrictEqual(truthValues, [true, true, true, false]);
    });

    it('should generate a truth table for (A -> B) ∧ (B -> A)', () => {
      const output = Calculator.generateTruthTable('(A -> B) ∧ (B -> A)');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['A', 'B', '(A -> B) ∧ (B -> A)']);
      assert.deepStrictEqual(truthCombinations, [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ]);
      assert.deepStrictEqual(truthValues, [true, false, false, true]);
    });

    it('should generate a truth table for (A ∨ B) -> (B -> A)', () => {
      const output = Calculator.generateTruthTable('(A ∨ B) -> (B -> A)');

      const {headers, truthCombinations, truthValues} = output;
      assert.deepStrictEqual(headers, ['A', 'B', '(A ∨ B) -> (B -> A)']);
      assert.deepStrictEqual(truthCombinations, [
        [false, false],
        [false, true],
        [true, false],
        [true, true],
      ]);
      assert.deepStrictEqual(truthValues, [true, false, true, true]);
    });
  });

  describe('isSemanticConsequence', () => {
    describe('Inference Rules', () => {
      it('should validate an application of Modus Ponens', () => {
        const output = Calculator.isSemanticConsequence(['P->Q', 'P'], 'Q');
        assert.ok(output);
      });

      it('should validate an application of Modus Tollens', () => {
        const output = Calculator.isSemanticConsequence(['P->Q', '¬Q'], '¬P');
        assert.ok(output);
      });

      it('should validate an application of Hypothetical Syllogism', () => {
        const output = Calculator.isSemanticConsequence(
          ['P->Q', 'Q->R'],
          'P->R'
        );
        assert.ok(output);
      });

      it('should validate an application of Disjunctive Syllogism', () => {
        const output = Calculator.isSemanticConsequence(['P ∨ Q', '¬P'], 'Q');
        assert.ok(output);
      });

      it('should validate an application of Constructive Dilemma', () => {
        const output = Calculator.isSemanticConsequence(
          ['P -> Q', 'R -> S', 'P ∨ R'],
          'Q ∨ S'
        );
        assert.ok(output);
      });

      it('should validate an application of Reductio ad Absurdum', () => {
        const output = Calculator.isSemanticConsequence(
          ['P->(Q ∨ R)', 'R -> (P ∧ ¬P)', 'P', '¬Q'],
          '¬P'
        );
        assert.ok(output);
      });

      it('should validate an application of Conditional Proof', () => {
        const output = Calculator.isSemanticConsequence(
          ['A->B', 'B->C', 'A'],
          'A->C'
        );
        assert.ok(output);
      });

      it('should validate an application of Contraposition', () => {
        const output = Calculator.isSemanticConsequence(
          ['(P ∧ ¬Q) -> (¬Q ∧ X)'],
          '¬(¬Q ∧ X) -> ¬(P ∧ ¬Q)'
        );
        assert.ok(output);
      });

      it('should validate an application of Negation of Conditional', () => {
        const output = Calculator.isSemanticConsequence(['¬(P->Q)'], 'P ∧ ¬Q');
        assert.ok(output);
      });

      it('should validate an application of Associativity (Biconditional)', () => {
        const output = Calculator.isSemanticConsequence(
          ['(P<->Q)<->R'],
          'P<->(Q<->R)'
        );
        assert.ok(output);
      });

      it('should validate an application of Associativity (Conjunction)', () => {
        const output = Calculator.isSemanticConsequence(
          ['(P ∧ Q) ∧ R'],
          'P ∧ (Q ∧ R)'
        );
        assert.ok(output);
      });

      it('should validate an application of Associativity (Disjunction)', () => {
        const output = Calculator.isSemanticConsequence(
          ['(P ∨ Q) ∨ R'],
          'P ∨ (Q ∨ R)'
        );
        assert.ok(output);
      });

      it('should validate an application of Commutativity (Biconditional)', () => {
        const output = Calculator.isSemanticConsequence(['(P<->Q)'], 'Q<->P');
        assert.ok(output);
      });

      it('should validate an application of Commutativity (Conjunction)', () => {
        const output = Calculator.isSemanticConsequence(['(P ∧ Q)'], 'Q ∧ P');
        assert.ok(output);
      });

      it('should validate an application of Commutativity (Disjunction)', () => {
        const output = Calculator.isSemanticConsequence(['(P ∨ Q)'], 'Q ∨ P');
        assert.ok(output);
      });

      it('should validate an application of Distribution', () => {
        const output = Calculator.isSemanticConsequence(
          ['(P ∨ Q) ∧ R'],
          '(P ∧ R) ∨ (Q ∧ R)'
        );
        assert.ok(output);
      });

      it('should validate an application of De Morgan (Conjunction)', () => {
        const output = Calculator.isSemanticConsequence(
          ['¬(P ∧ Q)'],
          '¬P ∨ ¬Q'
        );
        assert.ok(output);
      });

      it('should validate an application of De Morgan (Disjunction)', () => {
        const output = Calculator.isSemanticConsequence(
          ['¬(P ∨ Q)'],
          '¬P ∧ ¬Q'
        );
        assert.ok(output);
      });

      it('should validate an application of Implication Introduction', () => {
        const output = Calculator.isSemanticConsequence(['P'], 'Q->P');
        assert.ok(output);
      });

      it('should validate an application of Biconditional Introduction', () => {
        const output = Calculator.isSemanticConsequence(
          ['P->Q', 'Q->P'],
          'P <-> Q'
        );
        assert.ok(output);
      });

      it('should validate an application of Conjunction Introduction', () => {
        const output = Calculator.isSemanticConsequence(['P', 'Q'], 'P ∧ Q');
        assert.ok(output);
      });

      it('should validate an application of Disjunction Introduction', () => {
        const output = Calculator.isSemanticConsequence(['P'], 'P ∨ R');
        assert.ok(output);
      });

      it('should validate an application of Biconditional Simplification', () => {
        const output = Calculator.isSemanticConsequence(
          ['P <-> Q'],
          '(P->Q) ∧ (Q->P)'
        );
        assert.ok(output);
      });

      it('should validate an application of Conjunction Simplification', () => {
        const output = Calculator.isSemanticConsequence(['P ∧ Q'], 'P');
        const output2 = Calculator.isSemanticConsequence(['P ∧ Q'], 'Q');
        assert.ok(output);
        assert.ok(output2);
      });

      it('should validate an application of Negation Simplification', () => {
        const output = Calculator.isSemanticConsequence(['¬¬¬¬P'], 'P');
        assert.ok(output);
      });
    });

    describe('Fallacies', () => {
      it('should invalidate a fallacy of asserting the consequent', () => {
        const output = Calculator.isSemanticConsequence(['P->Q', 'Q'], 'P');
        assert.ok(!output);
      });

      it('should invalidate a fallacy of asserting the disjunct', () => {
        const output = Calculator.isSemanticConsequence(['P ∨ Q', 'P'], '¬Q');
        assert.ok(!output);
      });
    });
  });
});
