export type CaseStudy = {
  slug: string;
  title: string;
  org: string;
  year: string;
  problem: string;
  build: string;
  result: string;
  tags: string[];
};

export const work: CaseStudy[] = [
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
  {
    slug: 'commissions-reconciliation',
    title: 'Commissions data reconciliation across a platform migration',
    org: 'The Moderate Genius',
    year: '2026',
    problem:
      'A migration from Moniflo V1 to V2 left commission records inconsistent between the two systems, so payment tracking did not line up.',
    build:
      'Reconciled the two datasets and backfilled the missing data points needed to align commission tracking across versions.',
    result: 'Payment tracking matched across V1 and V2.',
    tags: ['PostgreSQL', 'Data migration', 'Reconciliation'],
  },
  {
    slug: 'ericassistant',
    title: 'EricAssistant — a second-brain workspace',
    org: 'Personal',
    year: '2026',
    problem:
      'Recurring context — background, priorities, preferences, past decisions — had to be re-explained to an AI assistant every session.',
    build:
      'A Claude Code workspace structured as an executive assistant: context files, an append-only decision log, reusable templates, and a place for skills to accrete as workflows repeat.',
    result: 'The assistant carries context between sessions instead of starting cold.',
    tags: ['Claude Code', 'Automation', 'Knowledge management'],
  },
];
