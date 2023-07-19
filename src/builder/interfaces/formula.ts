type PropositionalVariable = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

interface UnaryOperation {
  value: Formula;
}

interface BinaryOperation {
  right: Formula;
  left: Formula;
}

interface Conjunction extends BinaryOperation {
  readonly operation: 'Conjunction'
}

interface Disjunction extends BinaryOperation {
  readonly operation: 'Disjunction'
}

interface Implication extends BinaryOperation {
  readonly operation: 'Implication'
}

interface Biconditional extends BinaryOperation {
  readonly operation: 'Biconditional'
}

interface Negation extends UnaryOperation {
  readonly operation: 'Negation'
}

type Formula =
  PropositionalVariable |
  Negation |
  Conjunction |
  Disjunction |
  Implication |
  Biconditional;
