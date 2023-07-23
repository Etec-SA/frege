import { Negation } from './operations/unary-operation';
import { PropositionalVariable } from './propositional-variable';

export type AtomicFormula = PropositionalVariable | Negation;
