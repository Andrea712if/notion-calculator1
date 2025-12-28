const screen = document.getElementById("screen");
const keys = document.getElementById("keys");

let expr = "";
let justCalculated = false;

function updateScreen(value){
  screen.value = value || "0";
}

function safeEval(expression){
  // permite números, + - * / . ( ) espacios y * (para **)
  if(!/^[0-9+\-*/().\s*]+$/.test(expression)) return null;

  try{
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict";return (${expression})`)();
    return Number.isFinite(result) ? result : null;
  }catch{
    return null;
  }
}

keys.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if(!btn) return;

  const value = btn.dataset.value;
  const action = btn.dataset.action;

  if(action === "clear"){
    expr = "";
    updateScreen("0");
    return;
  }

  if(action === "equals"){
    const result = safeEval(expr);
    if(result === null){
      updateScreen("Error");
      return;
    }
    expr = String(result);
    updateScreen(expr);
    justCalculated = true;
    return;
  }

  if(action === "pow"){
    if(expr && !expr.endsWith("**")) expr += "**";
    updateScreen(expr);
    return;
  }

  if(action === "percent"){
    expr += "/100";
    updateScreen(expr);
    return;
  }

  if(action === "sqrt"){
    expr += "**0.5";
    updateScreen(expr);
    return;
  }

  if(action === "lpar"){
    expr += "(";
    updateScreen(expr);
    return;
  }

  if(action === "rpar"){
    expr += ")";
    updateScreen(expr);
    return;
  }

  if(value){
    if(justCalculated && /[0-9]/.test(value)){
      expr = "";
      justCalculated = false;
    } else if (justCalculated) {
      justCalculated = false;
    }

    // Convertir símbolos bonitos en operadores reales
    const mapped =
      value === "×" ? "*" :
      value === "÷" ? "/" :
      value === "−" ? "-" :
      value;

    expr += mapped;
    updateScreen(expr);
  }
});
