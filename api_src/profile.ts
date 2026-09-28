/**
 * GET /api/profile — the live CV and projects the site renders.
 *
 * Public on purpose: it is the same information as the downloadable CV. Edge
 * caching keeps it cheap; a sync reaches visitors within about 30 seconds.
 */
import { methodNotAllowed, route, sendJson } from './_lib/http';
import { getProfile, getProjects } from './_lib/store';

export default route(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return methodNotAllowed(res, ['GET']);
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  sendJson(res, 200, { profile, projects }, 'public, max-age=0, s-maxage=30, stale-while-revalidate=300');
});
