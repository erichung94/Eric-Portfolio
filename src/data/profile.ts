export const profile = {
  name: { first: 'Eric', last: 'Hung' },
  dev: {
    eyebrow: 'Full-stack developer · Minneapolis, MN',
    // The two taglines are one sentence split across the modes; the capitalised
    // word echoes the switch label directly above it.
    tagline: 'Developer by day…',
  },
  dance: {
    eyebrow: 'West Coast Swing · Twin Cities, MN',
    tagline: '…Dancer by night',
  },
  links: {
    email: 'erichung.94@gmail.com',
    github: 'https://github.com/erichung94',
    linkedin: 'https://www.linkedin.com/in/erichung-tech',
    instagram: '', // Eric to supply; Contact section hides the link while empty
  },
  // One photo per mode. Leave a value empty and that mode's hero/about simply
  // renders without an image rather than showing a placeholder box.
  photos: {
    dev: '/images/headshot-dev.jpg',
    // PLACEHOLDER: the dev headshot standing in so the mirrored dance layout can
    // be seen. Replace with a real dance photo before launch (see docs/DEPLOY.md)
    // and drop the .hero--dance .hero__shot mirror rule in global.css if the new
    // photo should not be flipped.
    dance: '/images/headshot-dev.jpg',
  },
  resume: '/EricHung_Resume.pdf',
} as const;
