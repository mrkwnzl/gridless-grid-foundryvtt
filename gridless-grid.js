Hooks.on("preUpdateToken", (token, changes, data, ...args) => {
  if (!(changes.x || changes.y)) return;
  if (token.parent.grid.type != 0) return;

  const gridSize = token.parent.dimensions.size;

  if (game.keyboard.isModifierActive("Shift")) {
    if (changes.x) changes.x = Math.round(changes.x / gridSize) * gridSize;
    if (changes.y) changes.y = Math.round(changes.y / gridSize) * gridSize;
  }
});