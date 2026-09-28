/**
 * GET /api/profile — the live CV and projects the site renders.
 *
 * Public on purpose: it is the same information as the downloadable CV. Edge
 * caching keeps it cheap; a sync reaches visitors within about 30 seconds.
 */
import { methodNotAllowed, route, sendJson } from './_lib/http';
import { getProfile, getProjects } from './_lib/store';
import { INITIAL_CV_DATA, SHOWCASE_PROJECTS } from '../src/data/initialData';

export default route(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return methodNotAllowed(res, ['GET']);
  try {
    const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
    sendJson(res, 200, { profile, projects }, 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');
  } catch (e) {
    // Storage trouble must never blank the CV: serve the bundled copy, briefly cached.
    console.error('[profile] storage unavailable, serving bundled CV', e);
    sendJson(res, 200, { profile: INITIAL_CV_DATA, projects: SHOWCASE_PROJECTS, fallback: true }, 'public, max-age=0, s-maxage=10');
  }
});
