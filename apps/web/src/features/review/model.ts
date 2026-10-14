import type { SchoolReviewProgress } from '@sdl/content-schema';
import {
  evaluateSchoolReview,
  sameSchoolConfig,
  type SchoolScenarioId,
} from '@sdl/simulation-engine';
/** Completion is a saved exercise, never a competency judgement. Recompute imported results. */
export function isSchoolReviewSaved(state: SchoolReviewProgress | undefined, id: SchoolScenarioId) {
  const run = state?.runs[id];
  return (
    !!state?.saved[id] &&
    !!run &&
    sameSchoolConfig(state.configs[id], run) &&
    evaluateSchoolReview(id, run).passed &&
    state.reflections[id].trim().length > 0
  );
}
