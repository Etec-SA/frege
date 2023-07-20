import { Formula } from "src/builder/interfaces/formula";
import { Biconditional } from "src/builder/interfaces/operations/biconditional";
import { Conjunction } from "src/builder/interfaces/operations/conjunction";
import { Disjunction } from "src/builder/interfaces/operations/disjunction";
import { Implication } from "src/builder/interfaces/operations/implication";

export class reducer {

  private static map = {
    'Biconditional': this.biconditional.bind(this),
    'Implication': this.implication.bind(this),
    'Conjunction': this.conjunction.bind(this),
    'Disjunction': this.disjunction.bind(this)
  }

  public static reduceFormula(x: Formula){
    if (typeof x === "string") return x;

    const { operation } = x
    
    return this.map[operation](x);
  }

  
  private static biconditional(x: Biconditional){
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    const reducedLeft = this.reduceFormula({
      operation: "Implication",
      left: left,
      right: right,
    });

    const reducedRight = this.reduceFormula({
      operation: "Implication",
      left: right,
      right: left,
    });

    return {
      operation: "Conjunction",
      left: reducedLeft,
      right: reducedRight,
    };
  }

  private static implication(x: Implication){
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    return {
      operation: "Disjunction",
      left: {
        operation: "Negation",
        value: left,
      },
      right: right,
    };
  }

  private static conjunction(x: Conjunction){
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    return {
      operation: "Conjunction",
      left: left,
      right: right,
    };
  }

  private static disjunction(x: Disjunction){
    const left = this.reduceFormula(x.left);
    const right = this.reduceFormula(x.right);

    return {
      operation: "Disjunction",
      left: left,
      right: right,
    };
  }
}