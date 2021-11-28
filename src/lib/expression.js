import * as assert from "assert";

/**
 * @param {[]} elements
 * @param {HashMap} operators
 */
export function ExecutePostfixExpression(elements, operators) {
    assert(elements.length > 0, 'Executing empty expression');
    let stack = [];
    for (let i = 0; i < elements.length; i++) {
        let e = elements[i];
        if (typeof e === "string" && operators.Has(e)) { // e is an operator
            let f = operators.Get(e).func;
            assert(stack.length >= 2, 'Invalid postfix expression with too many operators');
            let b = stack.pop();
            let a = stack.pop();
            stack.push(f(a, b));
        } else { // e is an operand
            stack.push(elements[i]);
        }
    }
    assert(stack.length === 1, 'Invalid postfix expression with too many operands');
    return stack[0];
}

/**
 * @param {String[]} elements
 * @param {HashMap} operators
 */
export function InFixExpressionToPostfix(elements, operators) {
    let i = 0;
    let stack = [], ret = [];
    while (i < elements.length) {
        let e = elements[i];
        if (e === '(') {
            stack.push({
                op: '(',
                p: -1,
            });
        } else if (e === ')') {
            while (stack.length > 0 && stack[stack.length - 1].op !== '(') {
                ret.push(stack.pop().op);
            }
            if (stack.length > 0) {
                stack.pop();
            }
        } else if (operators.Has(e)) { // e is an operator
            let p = operators.Get(e).priority;
            while (stack.length > 0 && stack[stack.length - 1].p >= p) {
                ret.push(stack.pop().op);
            }
            stack.push({
                op: e,
                p: p,
            })
        } else { // e is an operand
            ret.push(e);
        }
        i++;
    }
    while (stack.length > 0) {
        ret.push(stack.pop().op);
    }
    return ret;
}
