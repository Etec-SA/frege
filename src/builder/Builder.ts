import { Formula } from "./interfaces/formula";

export class builder {

  private static operations = {
    'Biconditional': this.biconditional,
    'Conjunction': this.conjunction,
    'Disjunction': this.disjunction,
    'Implication': this.implication
  }
  
  private static biconditional(left: Formula, right: Formula){
    return `(${left} ↔ ${right})`;
  }

  private static conjunction(left: Formula, right: Formula) {
    return `(${left} ∧ ${right})`;
  }

  private static disjunction(left: Formula, right: Formula) {
    return `(${left} ∨ ${right})`;
  }

  private static implication(left: Formula, right: Formula){
    return `(${left} -> ${right})`;
  }

  public static buildFormula(formula: Formula){
    if(typeof formula === 'string') return formula;

    if('operation' in formula && formula.operation === 'Negation')
      return `¬(${this.buildFormula(formula.value)})`;

    if(!('operation' in formula))
      throw new Error('Fórmula inválida'); 
    
    const left =  this.buildFormula(formula.left);
    const right = this.buildFormula(formula.right);
    const operation = formula.operation;

    return this.operations[operation](left, right);
  }
}