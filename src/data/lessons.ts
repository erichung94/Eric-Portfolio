export const lessons = {
  blurb:
    'West Coast Swing private lessons in the Twin Cities, for first-timers through competitive dancers. (Placeholder copy — replace before launch.)',
  location: 'Twin Cities, MN',
  rates: 'Contact for current rates.',
  bookingEmail: 'erichung.94@gmail.com',
  bookingSubject: 'West Coast Swing lesson inquiry',
} as const;

export const bookingHref =
  `mailto:${lessons.bookingEmail}?subject=${encodeURIComponent(lessons.bookingSubject)}`;
