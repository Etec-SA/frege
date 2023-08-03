import { PropositionalVariable } from "../operations/propositional-variable";

export type TruthValue = 0 | 1 | true | false;

export type PropositionalVariableValues = {
    [K in PropositionalVariable]?: boolean;
};

export type TruthTable = [string[], TruthValue[][], boolean[]];