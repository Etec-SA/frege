import { PropositionalVariable } from '../operations/propositional-variable';

export type Operator = '¬' | '∧' | '∨' | '->' | '<->';
export type Boundary = '(' | ')';
export type TokenType = 'variable' | 'operator' | 'boundary';

export type TokenMap = {
  variable: PropositionalVariable;
  operator: Operator;
  boundary: Boundary;
};

export type Token = {
  [K in keyof TokenMap]: { type: K; value: TokenMap[K] };
}[keyof TokenMap];
