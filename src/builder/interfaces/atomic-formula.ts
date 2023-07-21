import { Negation } from "./operations/negation";
import { PropositionalVariable } from "./propositional-variable";

export type AtomicFormula = PropositionalVariable | Negation;