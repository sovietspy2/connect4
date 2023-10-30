// events coming from the user
const USER_EVENT = {
  HOST_GAME: "host-game",
  JOIN_GAME: "join-game",
  PLAYER_MOVE: "player-move",
  PLAYER_SURRENDER: "player-surrender",
};

// broadcasting events to both players
const SERVER_EVENT = {
  GAME_START: "game-start",
  GAME_END: "game-end",
  MATCH_MOVE: "player-move",
};

exports = { USER_EVENT, SERVER_EVENT };
