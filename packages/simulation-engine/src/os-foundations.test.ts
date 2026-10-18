import { expect, it } from 'vitest';
import { addressSpace, fileHandles, ioLoop } from './os-foundations';
it('base-and-bounds separates two processes and rejects the exact limit before access', () => {
  for (const process of ['A', 'B'])
    for (const address of [0, 3, 4])
      for (const operation of ['read', 'write']) {
        const s = addressSpace({ process, address, operation, step: 1, modelVersion: 1 });
        expect(s.physical).toBe(address === 4 ? null : (process === 'A' ? 4 : 8) + address);
        expect(s.ram.slice(0, 4)).toEqual(['OS', 'OS', 'OS', 'OS']);
        expect(s.ram.slice(process === 'A' ? 8 : 4, process === 'A' ? 12 : 8)).toEqual(
          process === 'A' ? ['B0', 'B1', 'B2', 'B3'] : ['A0', 'A1', 'A2', 'A3'],
        );
        if (address === 4) expect(s.ram).toEqual(addressSpace({}).ram);
        else
          expect(s.result).toBe(operation === 'write' ? `${process} mới` : `${process}${address}`);
      }
});
it('unlink removes the name while an open descriptor retains access until close', () => {
  expect(fileHandles({ step: 0, modelVersion: 1 })).toMatchObject({
    pathExists: true,
    descriptorOpen: false,
    fileAllocated: true,
  });
  expect(fileHandles({ step: 2, modelVersion: 1 })).toMatchObject({
    pathExists: false,
    descriptorOpen: true,
    fileAllocated: true,
    readResult: null,
  });
  expect(fileHandles({ step: 3, modelVersion: 1 }).readResult).toBe('Lịch: phòng 205');
  expect(fileHandles({ step: 4, modelVersion: 1 })).toMatchObject({
    pathExists: false,
    descriptorOpen: false,
    fileAllocated: false,
  });
});
it('nonblocking lets B finish earlier without accelerating A or creating another CPU', () => {
  expect(ioLoop({ mode: 'blocking', step: 6, modelVersion: 1 })).toMatchObject({
    step: 6,
    aDone: true,
    bDone: true,
    finished: true,
  });
  expect(ioLoop({ step: 5, modelVersion: 1 })).toMatchObject({
    step: 5,
    aDone: true,
    bDone: true,
    finished: true,
  });
  expect(ioLoop({ step: 6, modelVersion: 1 }).step).toBe(0);
  expect(ioLoop({ step: 2, modelVersion: 1 }).bDone).toBe(true);
  expect(ioLoop({ mode: 'blocking', step: 2, modelVersion: 1 }).bDone).toBe(false);
  for (const mode of ['blocking', 'nonblocking']) {
    expect(ioLoop({ mode, step: 4, modelVersion: 1 })).toMatchObject({
      aDone: false,
      ready: true,
      ioPending: false,
    });
    expect(ioLoop({ mode, step: 5, modelVersion: 1 }).aDone).toBe(true);
  }
});
it('restores bounded checkpoints, ignores forged results and keeps input immutable', () => {
  for (const simulate of [addressSpace, fileHandles, ioLoop]) {
    for (const step of [-1, 99, 1.2, '1', Infinity])
      expect(simulate({ step, modelVersion: 1 }).step).toBe(0);
    expect(simulate({ step: 1, modelVersion: 2 }).step).toBe(0);
    const input = { step: 1, modelVersion: 1, result: 'forged', ram: 'forged' };
    const copy = structuredClone(input);
    simulate(input);
    expect(input).toEqual(copy);
  }
});
