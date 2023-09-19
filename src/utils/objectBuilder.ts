import { 
    Biconditional, 
    Conjunction, 
    Disjunction, 
    Formula, 
    Implication, 
    Negation 
} from "types";

export function implication(left: Formula, right: Formula){
    let implication: Implication = { operation: 'Implication', left, right };
    return implication;
}

export function biconditional(left: Formula, right: Formula){
    let biconditional: Biconditional = { operation: 'Biconditional', left, right };
    return biconditional;
}

export function conjunction(left: Formula, right: Formula){
    let conjunction: Conjunction = { operation: 'Conjunction', left, right };
    return conjunction;
}

export function disjunction(left: Formula, right: Formula){
    let disjunction: Disjunction = { operation: 'Disjunction', left, right };
    return disjunction;
}

export function negation(value: Formula){
    let negation: Negation = { operation: 'Negation', value };
    return negation;
}