import { Negation } from '../operations/unary-operation';
import { PropositionalVariable } from '../operations/propositional-variable';

export type AtomicFormula = PropositionalVariable | Negation;
