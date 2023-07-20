import { Formula } from "src/builder/interfaces/formula";
import { Biconditional } from "src/builder/interfaces/operations/biconditional";
import { Conjunction } from "src/builder/interfaces/operations/conjunction";
import { Disjunction } from "src/builder/interfaces/operations/disjunction";
import { Implication } from "src/builder/interfaces/operations/implication";
import { Negation } from "src/builder/interfaces/operations/negation";

export class reducer {
  public static reduceFormula(x: Formula){
    if (typeof x === "string") return x;

    switch (x.operation) {
      case "Biconditional":
        return this.biconditional(x);
      case "Implication":
        return this.implication(x);
      case "Conjunction":
        return this.conjunction(x);
      case "Disjunction":
        return this.disjunction(x);
      case "Negation":
        return this.negation(x);
      default:
        throw new Error("Invalid operation");
    }
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

  private static negation(x: Negation){
    const value = this.reduceFormula(x.value);

    return {
      operation: "Negation",
      value
    };
  }
}