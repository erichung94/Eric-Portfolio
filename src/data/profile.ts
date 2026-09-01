export const profile = {
  name: { first: 'Eric', last: 'Hung' },
  dev: {
    eyebrow: 'Full-stack developer · Minneapolis, MN',
    tagline: 'dev by day…',
  },
  dance: {
    eyebrow: 'West Coast Swing · Twin Cities, MN',
    tagline: '…dancer by night',
  },
  links: {
    email: 'erichung.94@gmail.com',
    github: 'https://github.com/erichung94',
    linkedin: 'https://www.linkedin.com/in/erichung-tech',
    instagram: '', // Eric to supply; Contact section hides the link while empty
  },
  headshot: '/images/headshot.png',
  resume: '/EricHung_Resume.pdf',
} as const;
