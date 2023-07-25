export interface UnknownFormula {
    operation: "Disjunction" | "Conjunction" | "Implication" | "Biconditional" | "Negation";
    left?: any;
    right?: any;
    value?: any;
}
