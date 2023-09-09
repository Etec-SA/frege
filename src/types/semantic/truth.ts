import { PropositionalVariable } from "../operations/propositional-variable";

export type TruthValue = 0 | 1 | true | false;

/**
   * Represents a mapping of propositional variables to their truth values.
   */
export type PropositionalVariableValues = {
  [K in PropositionalVariable]?: boolean;
};

/**
  * Represents a truth table containing headers, truth combinations, and truth values.
  * 
  * @example
  * ```
  *  {
  *    headers: ['P', 'Q', '(P -> Q)'],
  *    truthCombinations: [
  *      [0, 0], [0, 1],
  *      [1, 0], [1, 1]
  *    ],
  *    truthValues: [true, true, false, true]
  * }
  * ```
  */
export interface TruthTable {
  /**
   * An array of headers representing the variables and formula.
   *
   * @property {string[]}
   */
  headers: string[];
  /**
   * An array of arrays representing truth combinations for each variable.
   *
   * @property {TruthValue[][]}
   */
  truthCombinations: TruthValue[][];
  /**
   * An array of truth values representing the truth values for each combination.
   *
   * @property {TruthValue[]}
   */
  truthValues: TruthValue[];
}
