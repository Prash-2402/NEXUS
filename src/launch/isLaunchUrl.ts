/** `/launch` (or `#launch`) opens the stage launch sequence instead of the plain site. */
export function isLaunchUrl() {
  const path = window.location.pathname.replace(/\/+$/, '');
  return path === '/launch' || window.location.hash === '#launch';
}
