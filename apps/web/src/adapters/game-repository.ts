import { GAME_VERSION, parseGame, type GameId, type GameState } from '@sdl/learning-core';
const key = (id: GameId) => `sdl-game-v${GAME_VERSION}-${id}`;
export function readGame(id: GameId): GameState {
  try {
    return parseGame(JSON.parse(localStorage.getItem(key(id)) ?? 'null'), id);
  } catch {
    return { id, actions: [] };
  }
}
export function writeGame(state: GameState): boolean {
  try {
    localStorage.setItem(key(state.id), JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
