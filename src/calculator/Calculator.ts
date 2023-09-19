import { Builder } from 'builder/Builder';

import {
  Formula,
  TruthTable,
  PropositionalVariable,
  PropositionalVariableValues,
  Implication,
  Biconditional,
  Conjunction,
  Disjunction,
  Negation,
  TruthValue,
} from 'types';
import {
  isPropositionalVariable,
  parseToFormulaObject,
  isArrayString,
  parseToFormulaString,
  buildConjunctionString,
  isNegation,
} from 'utils';

/**
 * Class responsible for performing semantic truth-value operations, such as evaluate formulas and generate truth tables.
 */
export class Calculator {
  /**
   * Generates a truth table for the given formula.
   *
   * @param formula - The logical formula to generate a truth table for.
   * @param stringfiedFormula - An optional string representation of the formula.
   * @returns The truth table as an array containing headers, truth combinations, and results.
   *
   * @example
   * const output = Calculator.generateTruthTable('P -> Q');
   * console.log(output);
   * // Output:
   * // {
   * //   headers: ['P', 'Q', '(P -> Q)'],
   * //   truthCombinations: [
   * //     [false, false], [false, true],
   * //     [true, false], [true, true]
   * //   ],
   * //   truthValues: [true, true, false, true]
   * // }
   */
  public static generateTruthTable(
    formula: Formula | string,
    stringfiedFormula?: string
  ): TruthTable {
    if (typeof formula === 'string' && !isPropositionalVariable(formula)) {
      const parsedFormula = parseToFormulaObject(formula);
      return Calculator.generateTruthTable(parsedFormula, formula);
    }

    const variables = new Set<PropositionalVariable>();
    Calculator.collectVariables(formula, variables);

    const variableArray = Array.from(variables);

    const truthCombinations = Calculator.generateTruthCombinations(
      variableArray.length
    );

    const table: TruthTable = {
      headers: [],
      truthCombinations: [],
      truthValues: []
    };
    
    variableArray.forEach((variable) => {
      table.headers.push(variable);
    });

    stringfiedFormula = stringfiedFormula || Builder.buildFormula(formula);

    table.headers.push(stringfiedFormula);

    truthCombinations.forEach((combination) => {
      const values: PropositionalVariableValues = {};

      variableArray.forEach((variable, index) => {
        values[variable] = !!(combination[index]);
      });

      table.truthCombinations.push(combination);

      const result = Calculator.evaluate(formula, values);

      table.truthValues.push(result);
    });

    return table;
  }

  /**
   * Evaluates the given logical formula with the provided truth values for variables.
   *
   * @param formula - The logical formula to evaluate.
   * @param values - An object representing truth values for propositional variables.
   * @returns The result of the evaluation (true or false).
   *
   * @example
   * const result = Calculator.evaluate('P -> Q', { P: true, Q: false });
   * console.log(result); // Output: false
   */
  public static evaluate<T extends Formula>(
    formula: T | string,
    values: PropositionalVariableValues
  ): boolean {
    if (typeof formula === 'string' && !isPropositionalVariable(formula)) {
      const parsedFormula = parseToFormulaObject(formula);
      return Calculator.evaluate(parsedFormula, values);
    }

    if (typeof formula === 'string') return values[`${formula}`];

    if (formula.operation === 'Implication') {
      return Calculator.evaluateImplication(formula, values);
    }

    if (formula.operation === 'Biconditional') {
      return Calculator.evaluateBiconditional(formula, values);
    }

    if (formula.operation === 'Conjunction') {
      return Calculator.evaluateConjunction(formula, values);
    }

    if (formula.operation === 'Disjunction') {
      return Calculator.evaluateDisjunction(formula, values);
    }

    if (formula.operation === 'Negation') {
      return Calculator.evaluateNegation(formula, values);
    }

    throw new Error('Invalid formula operation');
  }

  /**
   * Checks if a given formula is a semantic consequence of the given premises.
   * A semantic consequence holds if, in every possible truth assignment to the propositional variables,
   * when all premises are true, the conclusion is also true.
   *
   * @param premises - An array of logical formulas or strings representing the premises.
   * @param conclusion - The conclusion formula to check as a semantic consequence.
   * @returns True if the conclusion is a semantic consequence of the premises, false otherwise.
   *
   * @example
   * const output = Calculator.isSemanticConsequence(['P->Q', 'P'], 'Q');
   * console.log(output); // Output: true
   */
  public static isSemanticConsequence(
    premises: Formula[] | string[],
    conclusion: Formula | string
  ): boolean {
    const variables = new Set<PropositionalVariable>();
    let conjunctionOfPremises: Formula;

    if (typeof conclusion === 'string' && !isPropositionalVariable(conclusion))
      conclusion = parseToFormulaObject(conclusion);

    if (premises.length === 1) {
      conjunctionOfPremises = typeof premises[0] === 'object'
          ? premises[0]
          : parseToFormulaObject(premises[0]);

    }else{
      
      if (!isArrayString(premises)) {
        premises = premises.map((premise) => parseToFormulaString(premise));
      }

      let conjunctionFormulaString: string = buildConjunctionString(premises);
      conjunctionOfPremises = parseToFormulaObject(conjunctionFormulaString);

    }

    Calculator.collectVariables(conjunctionOfPremises, variables);
    const variableArray = Array.from(variables);
    const truthCombinations = Calculator.generateTruthCombinations(variableArray.length);

    for (const combination of truthCombinations) {
      const values: PropositionalVariableValues = {};

      variableArray.forEach((variable, index) => {
        values[variable] = !!(combination[index]);
      });

      const allPremisesAreTrue = Calculator.evaluate(conjunctionOfPremises, values);

      if (allPremisesAreTrue && !Calculator.evaluate(conclusion, values))
        return false;
    }

    return true;
  }

  private static evaluateImplication(
    formula: Implication,
    values: PropositionalVariableValues
  ): boolean {
    const left = Calculator.evaluate(formula.left, values);
    const right = Calculator.evaluate(formula.right, values);
    return !left || right;
  }

  private static evaluateBiconditional(
    formula: Biconditional,
    values: PropositionalVariableValues
  ): boolean {
    const left = Calculator.evaluate(formula.left, values);
    const right = Calculator.evaluate(formula.right, values);
    return (left && right) || (!left && !right);
  }

  private static evaluateConjunction(
    formula: Conjunction,
    values: PropositionalVariableValues
  ): boolean {
    const left = Calculator.evaluate(formula.left, values);
    const right = Calculator.evaluate(formula.right, values);
    return left && right;
  }

  private static evaluateDisjunction(
    formula: Disjunction,
    values: PropositionalVariableValues
  ): boolean {
    const left = Calculator.evaluate(formula.left, values);
    const right = Calculator.evaluate(formula.right, values);
    return left || right;
  }

  private static evaluateNegation(
    formula: Negation,
    values: PropositionalVariableValues
  ): boolean {
    const value = Calculator.evaluate(formula.value, values);
    return !value;
  }

  protected static generateTruthCombinations(numVariables: number): boolean[][] {
    const combinations: boolean[][] = [];
    const totalCombinations = 2 ** numVariables;
  
    for (let i = 0; i < totalCombinations; i++) {
      const binaryString = i.toString(2).padStart(numVariables, '0');
      const combination: boolean[] = binaryString
        .split('')
        .map((bit) => bit === '1');
      combinations.push(combination);
    }
  
    return combinations;
  }
  

  private static collectVariables<T extends Formula>(
    formula: T,
    variables: Set<PropositionalVariable>
  ) {
    if (isPropositionalVariable(formula)) {
      variables.add(formula);
    } else if (isNegation(formula)) {
      Calculator.collectVariables(formula.value, variables);
    } else {
      Calculator.collectVariables(formula.left, variables);
      Calculator.collectVariables(formula.right, variables);
    }
  }
}
