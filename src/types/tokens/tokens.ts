import { PropositionalVariable } from "../operations/propositional-variable";

export type Operator = '¬' | '∧' | 'v' | '->' | '<->';
export type Boundary = '(' | ')';
export type TokenType = 'variable' | 'operator' | 'boundary';

export type TokenMap = {
  variable: PropositionalVariable;
  operator: Operator;
  boundary: Boundary;
};

export type Token<T extends TokenType> = {
  type: T;
  value: TokenMap[T];
};
