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
    repo: 'https://github.com/erichung94/Eric-Portfolio',
  },
  // One photo per mode. An empty value still reserves the hero slot and draws a
  // neutral box, so the mirrored layout stays reviewable; the About section for
  // that mode simply renders without an image.
  photos: {
    dev: '/images/headshot-dev.jpg',
    // Empty until Eric has a real dance photo. The hero still reserves the slot
    // and draws a neutral box, so the mirrored layout stays reviewable without
    // anyone mistaking a stand-in photo for the real thing.
    dance: '',
  },
  resume: '/EricHung_Resume.pdf',
} as const;
