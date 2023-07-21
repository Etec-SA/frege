import { Formula } from "src/builder/interfaces/formula";
import { MolecularFormula } from "src/builder/interfaces/molecular-formula";

export function isCompositeFormula(formula: Formula): formula is MolecularFormula {
    if(typeof formula === 'string') return false;

    if(formula.operation === 'Negation') return false;
    
    return true;
}