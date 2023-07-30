import frege from "src/index";
import { Formula } from "src/types/formulas/formula";
import { Biconditional, BinaryOperation, Conjunction, Disjunction, Implication } from "src/types/operations/binary-operations";
import { PropositionalVariable } from "src/types/operations/propositional-variable";
import { Negation } from "src/types/operations/unary-operation";

type PropositionalVariables<T extends Formula> =
  T extends PropositionalVariable ? T :
  T extends Negation ? PropositionalVariables<T["value"]> :
  T extends BinaryOperation ? PropositionalVariables<T["left"]> | PropositionalVariables<T["right"]> :
  never;

type PropositionalVariableValues<T extends Formula> = {
  [K in PropositionalVariables<T>]: boolean;
};

export class Calculator {
  public static evaluate(formula: Formula | string, values: PropositionalVariableValues<Formula>): boolean {
    if (typeof formula === 'string' && formula.length > 1) {
      const parsedFormula = frege.parse.toFormulaObject(formula);
      return this.evaluate(parsedFormula, values);
    }

    if (typeof formula === 'string') return values[formula];

    if (formula.operation === 'Implication') {
      return this.evaluateImplication(formula, values);
    }

    if (formula.operation === 'Biconditional') {
      return this.evaluateBiconditional(formula, values);
    }

    if (formula.operation === 'Conjunction') {
      return this.evaluateConjunction(formula, values);
    }

    if (formula.operation === 'Disjunction') {
      return this.evaluateDisjunction(formula, values);
    }

    if (formula.operation === 'Negation') {
      return this.evaluateNegation(formula, values);
    }

    throw new Error('Invalid formula operation');
  }

  private static evaluateImplication(formula: Implication, values: PropositionalVariableValues<Formula>): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return !left || right;
  }

  private static evaluateBiconditional(formula: Biconditional, values: PropositionalVariableValues<Formula>): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return (left && right) || (!left && !right);
  }

  private static evaluateConjunction(formula: Conjunction, values: PropositionalVariableValues<Formula>): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return left && right;
  }

  private static evaluateDisjunction(formula: Disjunction, values: PropositionalVariableValues<Formula>): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return left || right;
  }

  private static evaluateNegation(formula: Negation, values: PropositionalVariableValues<Formula>): boolean {
    const value = this.evaluate(formula.value, values);
    return !value;
  }
}
