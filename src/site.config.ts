export const site = {
  name: 'Sean Russell',
  title: 'Sean Russell · Software Engineer',
  // The home page hero; also the home page's link-preview card (src/lib/og.ts).
  headline: 'Building things that work and fixing things that break.',
  lede: 'Full-stack engineer: frontend, backend, SRE and DevOps.',
  description:
    'Full-stack engineer. Building things that work and fixing things that break. Case studies, experiments and notes.',
  url: 'https://seanrusselldev.com',
  // Cloudflare Email Routing forwards it to Gmail (CUTOVER.md, phase 3).
  email: 'hello@seanrusselldev.com',
  github: 'https://github.com/TurbulentRice',
  // This site's own source; lab entries link to their folder in it.
  repo: 'https://github.com/TurbulentRice/sean-russell-dev',
  linkedin: 'https://www.linkedin.com/in/sean-russell-professional/',
  photo: 'https://www.seanrussellphoto.com',
};

// Notes joined the nav with its first post (P2 plan, decision 6).
export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/lab/', label: 'Lab' },
  { href: '/notes/', label: 'Notes' },
  { href: '/about/', label: 'About' },
];
