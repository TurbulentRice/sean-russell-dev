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
  linkedin: 'https://www.linkedin.com/in/sean-russell-professional/',
  photo: 'https://www.seanrussellphoto.com',
};

// Notes joins the nav once it has a few published posts (BRIEF, "Notes").
export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/lab/', label: 'Lab' },
  { href: '/about/', label: 'About' },
];
