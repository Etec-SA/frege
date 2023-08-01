import frege from 'src/index';
import { Formula } from 'src/types/formulas/formula';
import {
  Biconditional,
  Conjunction,
  Disjunction,
  Implication,
} from 'src/types/operations/binary-operations';
import { PropositionalVariable } from 'src/types/operations/propositional-variable';
import { Negation } from 'src/types/operations/unary-operation';
import { isPropositionalVariable } from 'src/utils/isPropositionalVariable';
import { PropositionalVariableValues, TruthValue } from 'src/types/semantic/truth';

export class Calculator {

  public static generateTruthTable(
    formula: Formula | string,
    stringfiedFormula?: string
  ): [string[], TruthValue[][], boolean[]] {
    
    if (typeof formula === 'string' && !isPropositionalVariable(formula)) {
      const parsedFormula = frege.parse.toFormulaObject(formula);
      return this.generateTruthTable(parsedFormula, formula);
    }

    const variables = new Set<PropositionalVariable>();
    this.collectVariables(formula, variables);

    const variableArray = Array.from(variables);

    
    const truthCombinations = this.generateTruthCombinations(
      variableArray.length
    );

    const table: [string[], TruthValue[][], boolean[]] = [[], [], []];

    
    variableArray.forEach((variable) => {
      table[0].push(variable);
    });

    
    stringfiedFormula =
      stringfiedFormula || frege.parse.toFormulaString(formula);
    
    table[0].push(stringfiedFormula);

    
    truthCombinations.forEach((combination) => {
      const values: PropositionalVariableValues = {} as PropositionalVariableValues;

      variableArray.forEach((variable, index) => {
        values[variable] = combination[index] === 1 || combination[index] === true;
      });

      table[1].push(combination);

      const result = this.evaluate(formula, values);

      table[2].push(result);
    });

    return table;
  }

  public static evaluate<T extends Formula>(
    formula: T | string,
    values: PropositionalVariableValues
  ): boolean {
    if (typeof formula === 'string' && formula.length > 1) {
      const parsedFormula = frege.parse.toFormulaObject(formula);
      return this.evaluate(parsedFormula as T, values);
    }

    if (typeof formula === 'string') return values[`${formula}`];

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

  private static evaluateImplication(
    formula: Implication,
    values: PropositionalVariableValues
  ): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return !left || right;
  }

  private static evaluateBiconditional(
    formula: Biconditional,
    values: PropositionalVariableValues
  ): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return (left && right) || (!left && !right);
  }

  private static evaluateConjunction(
    formula: Conjunction,
    values: PropositionalVariableValues
  ): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return left && right;
  }

  private static evaluateDisjunction(
    formula: Disjunction,
    values: PropositionalVariableValues
  ): boolean {
    const left = this.evaluate(formula.left, values);
    const right = this.evaluate(formula.right, values);
    return left || right;
  }

  private static evaluateNegation(
    formula: Negation,
    values: PropositionalVariableValues
  ): boolean {
    const value = this.evaluate(formula.value, values);
    return !value;
  }

  private static generateTruthCombinations(
    numVariables: number
  ): TruthValue[][] {
    const combinations: TruthValue[][] = [];
    const totalCombinations = 2 ** numVariables;

    for (let i = 0; i < totalCombinations; i++) {
      const binaryString = i.toString(2).padStart(numVariables, '0');
      const combination: TruthValue[] = binaryString
        .split('')
        .map(Number) as TruthValue[];
      combinations.push(combination);
    }

    return combinations;
  }

  private static collectVariables<T extends Formula>(
    formula: T,
    variables: Set<PropositionalVariable>
  ) {
    if (typeof formula === 'string') {
      variables.add(formula as PropositionalVariable);
    } else if (formula.operation === 'Negation') {
      this.collectVariables(formula.value, variables);
    } else {
      this.collectVariables(formula.left, variables);
      this.collectVariables(formula.right, variables);
    }
  }
}
