let snapToGrid = false;

Hooks.on("init", () => {
  // Register keybindings
  const {SHIFT, CONTROL, ALT} = KeyboardManager.MODIFIER_KEYS;
  game.keybindings.register("gridless-grid", "snapToGrid", {
    name: "Snap to Grid",
    editable: [
      {
        key: "ShiftLeft"
      }
    ],
    onDown: () => {snapToGrid = true;},
    onUp: () => {snapToGrid = false;},
    repeat: false
  });

  game.keybindings.register("gridless-grid", "stackTokens", {
    name: "Stack Tokens",
    editable: [
      {
        key: "KeyS",
        modifiers: [CONTROL, SHIFT]
      }
    ],
    onDown: () => {
      snapToGrid = false;
      stackTokens();
    },
    repeat: false
  });

  game.keybindings.register("gridless-grid", "disperseTokens", {
    name: "Disperse Tokens",
    editable: [
      {
        key: "KeyD",
        modifiers: [CONTROL, SHIFT]
      }
    ],
    onDown: () => {
      snapToGrid = false;
      disperseTokens();
    },
    repeat: false
  });

  game.keybindings.register("gridless-grid", "fanTokens", {
    name: "Fan Tokens Out",
    editable: [
      {
        key: "KeyF",
        modifiers: [CONTROL, SHIFT]
      }
    ],
    onDown: () => {
      snapToGrid = false;
      fanTokens();
    },
    repeat: false
  });
});

Hooks.on("preUpdateToken", (token, changes) => {
  if (!(changes.x || changes.y)) return;
  if (token.parent.grid.type != 0) return;

  const gridSize = token.parent.dimensions.size;

  if (snapToGrid) {
    if (changes.x) changes.x = Math.round(changes.x / gridSize) * gridSize;
    if (changes.y) changes.y = Math.round(changes.y / gridSize) * gridSize;
  }
});

async function stackTokens() {
  const tokens = canvas.tokens.controlled;
  if (tokens[0].document.parent.grid.type != 0) return;

  const coordinates = getAverageCoordinates(tokens);

  for (let token of tokens) {
    token.document.update({
      "x": coordinates[0],
      "y": coordinates[1],
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
    token.document.update({
      "x": newX,
      "y": newY,
    });
  }
}

async function fanTokens() {
  const tokens = canvas.tokens.controlled;
  if (tokens[0].document.parent.grid.type != 0) return;
  if (tokens.length < 2) return;

  const coordinates = getAverageCoordinates(tokens);

  const radius = tokens[0].document.parent.dimensions.size / 2;
  const rotation = (360 / tokens.length) * (Math.PI / 180);
  let i = 0;

  for (let token of tokens) {
    let newX = coordinates[0] + (radius * Math.cos(i));
    let newY = coordinates[1] + (radius * Math.sin(i));
    token.document.update({
      "x": newX,
      "y": newY,
    });
    i += rotation;
  }
}

function getAverageCoordinates(tokens) {
  if (!tokens) return;
  const arrayX = [];
  const arrayY = [];
  const gridSize = tokens[0].document.parent.dimensions.size;

  for (let token of tokens) {
    arrayX.push(token.document.x);
    arrayY.push(token.document.y);
  }

  let averageX = Math.round(((Math.min(...arrayX) + Math.max(...arrayX)) / 2) / gridSize) * gridSize;
  let averageY = Math.round(((Math.min(...arrayY) + Math.max(...arrayY)) / 2) / gridSize) * gridSize;

  return [averageX, averageY];
}