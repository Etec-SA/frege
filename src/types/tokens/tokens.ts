import { PropositionalVariable } from '../operations/propositional-variable';

/**
 * Represents logical operators used in propositional logic.
 * 
 * - '¬' (Negation): Represents logical negation (NOT).
 * - '∧' (Conjunction): Represents logical conjunction (AND).
 * - '∨' (Disjunction): Represents logical disjunction (OR).
 * - '->' (Implication): Represents logical implication (IF...THEN).
 * - '<->' (Biconditional): Represents logical biconditional (IF AND ONLY IF).
 * - '!' (Negation, alternative symbol): Represents logical negation (NOT).
 * - '&' (Conjunction, alternative symbol): Represents logical conjunction (AND).
 * - '|' (Disjunction, alternative symbol): Represents logical disjunction (OR).
 */
export type Operator = '¬' | '∧' | '∨' | '->' | '<->' | '!' | '&' | '|';

/**
   * Represents boundary characters used in propositional logic.
   */
export type Boundary = '(' | ')';

/**
   * Represents the types of possible tokens in a formula.
   */
export type TokenType = 'variable' | 'operator' | 'boundary';

/**
   * A map that associates token types with their corresponding values.
   * @property {PropositionalVariable} variable - Represents a propositional variable.
   * @property {Operator} operator - Represents a logical operator.
   * @property {Boundary} boundary - Represents a boundary character.
   */
export type TokenMap = {
  variable: PropositionalVariable;
  operator: Operator;
  boundary: Boundary;
};

/**
   * Represents a token in a formula.
   * @property {TokenType} type - The type of the token.
   * @property {PropositionalVariable | Operator | Boundary} value - The value of the token.
   * @example
   * const token: Token = { type: 'variable', value: 'P' };
   */
export type Token = {
  [K in keyof TokenMap]: { type: K; value: TokenMap[K] };
}[keyof TokenMap];
