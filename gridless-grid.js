Hooks.on("init", () => {
  // Register keybindings
  const {SHIFT, CONTROL, ALT} = KeyboardManager.MODIFIER_KEYS;
  game.keybindings.register("gridless-grid", "stackTokens", {
    name: "Stack Tokens",
    editable: [
      {
        key: "KeyS",
        modifiers: [CONTROL]
      }
    ],
    onDown: stackTokens,
    repeat: false
  });

  game.keybindings.register("gridless-grid", "disperseTokens", {
    name: "Disperse Tokens",
    editable: [
      {
        key: "KeyD",
        modifiers: [CONTROL]
      }
    ],
    onDown: disperseTokens,
    repeat: false
  });
});

Hooks.on("preUpdateToken", (token, changes) => {
  if (!(changes.x || changes.y)) return;
  if (token.parent.grid.type != 0) return;

  const gridSize = token.parent.dimensions.size;

  if (game.keyboard.isModifierActive("Shift")) {
    if (changes.x) changes.x = Math.round(changes.x / gridSize) * gridSize;
    if (changes.y) changes.y = Math.round(changes.y / gridSize) * gridSize;
  }
});

function stackTokens() {
  const tokens = canvas.tokens.controlled;
  if (tokens[0].document.parent.grid.type != 0) return;
  let arrayX = [];
  let arrayY = [];

  for (let token of tokens) {
    arrayX.push(token.document.x);
    arrayY.push(token.document.y);
  }

  const averageX = (Math.min(...arrayX) + Math.max(...arrayX)) / 2;
  const averageY = (Math.min(...arrayY) + Math.max(...arrayY)) / 2;

  for (let token of tokens) {
    token.document.update({
      "x": averageX,
      "y": averageY,
    });
  }
}

function disperseTokens() {
  const tokens = canvas.tokens.controlled;
  if (tokens[0].document.parent.grid.type != 0) return;

  const gridSize = tokens[0].document.parent.dimensions.size;

  for (let token of tokens) {
    let newX = token.document.x + ((Math.floor(Math.random() * gridSize * 2)) - gridSize);
    let newY = token.document.y + ((Math.floor(Math.random() * gridSize * 2)) - gridSize);
    console.log(newX);
    token.document.update({
      "x": newX,
      "y": newY,
    });
  }
}