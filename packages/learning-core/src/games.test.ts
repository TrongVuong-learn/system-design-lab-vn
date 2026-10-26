import { describe, expect, it } from 'vitest';
import { gameResult, playGame, parseGame, type GameId, type GameState } from './games';
function run(id: GameId, actions: number[]) {
  return gameResult(actions.reduce(playGame, { id, actions: [] } as GameState));
}
describe('teaching games', () => {
  it('distinguishes packet count from total load and prevents extra moves', () => {
    expect(run('balance', [0, 0, 1, 1, 1, 0])).toMatchObject({ loads: [9, 7], won: false });
    expect(run('balance', [0, 1, 0, 0, 1, 1])).toMatchObject({ loads: [8, 8], won: true });
    const state: GameState = { id: 'balance', actions: [0, 0, 0, 0, 0, 0] };
    expect(playGame(state, 1)).toBe(state);
    expect(playGame({ id: 'cache', actions: [] }, 3).actions).toEqual([]);
  });
  it('requires fresh cache results as well as low cost', () => {
    expect(run('cache', [1, 0, 1, 0, 1, 0])).toMatchObject({ correct: 6, cost: 12, won: true });
    expect(run('cache', [1, 1, 1, 1, 1, 1])).toMatchObject({ correct: 6, cost: 18, won: false });
    expect(run('cache', [0, 0, 0, 0, 0, 0])).toMatchObject({ correct: 0, cost: 6, won: false });
  });
  it('accounts for work conservation, overflow before service and budget', () => {
    expect(run('queue', [0, 1, 0, 1, 0, 0])).toMatchObject({
      served: 16,
      waiting: 0,
      lost: 0,
      cost: 8,
      won: true,
    });
    expect(run('queue', [0, 0, 0, 0, 0, 0]).lost).toBeGreaterThan(0);
    expect(run('queue', [2, 2, 2, 2, 2, 2])).toMatchObject({ cost: 18, won: false });
    for (let n = 0; n < 729; n++) {
      const actions = Array.from({ length: 6 }, (_, i) => Math.floor(n / 3 ** i) % 3);
      const result = run('queue', actions);
      expect(result.served + result.waiting + result.lost).toBe(16);
      expect(result.waiting).toBeGreaterThanOrEqual(0);
    }
  });
  it('rejects malformed saves and does not trust stored scores', () => {
    for (const bad of [
      null,
      { id: 'cache', actions: [-1] },
      { id: 'cache', actions: [1.2] },
      { id: 'cache', actions: ['1'] },
      { id: 'cache', actions: Array(7).fill(1) },
      { id: 'queue', actions: [1] },
    ])
      expect(parseGame(bad, 'cache')).toEqual({ id: 'cache', actions: [] });
    expect(parseGame({ id: 'cache', actions: [1], won: true }, 'cache')).toEqual({
      id: 'cache',
      actions: [1],
    });
  });
});
