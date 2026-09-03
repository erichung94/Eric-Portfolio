export type CaseStudy = {
  slug: string;
  title: string;
  org: string;
  year: string;
  problem: string;
  build: string;
  result: string;
  tags: string[];
  links?: { label: string; href: string }[];
};

export const work: CaseStudy[] = [
  {
    slug: 'stock-indicator-tool',
    title: 'Stock Indicator Tool',
    org: 'Personal',
    year: '2026',
    problem:
      'Technical analysis often lives in fragile spreadsheets that get copied and re-broken every time someone wants a different metric or a different set of stocks.',
    build:
      'A tool that pulls daily price data for a list of tickers, computes 25 technical indicators implemented from their definitions, and runs a hand-written Excel-style formula language so you can define your own indicators as named, reusable columns. The whole setup saves as a template. Streamlit app plus a CLI; CSV and Excel export.',
    result:
      'The metrics and the custom math are defined once and re-run on demand. Around 300 tests, roughly 94% line coverage, an independent review pass after each build phase.',
    tags: ['Python', 'pandas', 'Streamlit', 'Parser', 'Test-driven'],
    links: [
      { label: 'Source', href: 'https://github.com/erichung94/stock-indicator-tool' },
    ],
  },
  {
    slug: 'ai-onboarding-wizard',
    title: 'Conversational AI onboarding wizard',
    org: 'The Moderate Genius',
    year: '2026',
    problem:
      'New customers had to complete Twilio phone-number provisioning and A2P 10DLC compliance registration before sending a single message. The steps were error-prone and generated a steady stream of manual support work.',
    build:
      'A conversational onboarding wizard that walked each new account through setup, phone-number selection, and the A2P registration flow, validating inputs at each step.',
    result:
      'New accounts could reach a sending-ready state without hands-on support.',
    tags: ['TypeScript', 'Node', 'Twilio', 'A2P 10DLC', 'Onboarding UX'],
  },
  {
    slug: 'sms-follow-up-reliability',
    title: 'SMS follow-up system: quiet hours and failure handling',
    org: 'The Moderate Genius',
    year: '2026',
    problem:
      'The automated SMS follow-up sequence sent messages at all hours and, on a failed step, could silently stop or retry indefinitely.',
    build:
      'Added quiet-hours windows, per-lead time-zone resolution so sends land at a sensible local time, and one-time handling for failed steps so a failure neither loops nor disappears.',
    result:
      "Removed silent failures and repeated retries; follow-ups now send within each lead’s daytime hours.",
    tags: ['Node', 'Scheduling', 'Time zones', 'Reliability'],
  },
];
