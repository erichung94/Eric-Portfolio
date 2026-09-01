export type SkillGroup = { label: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    label: 'Languages & Frameworks',
    items: ['TypeScript', 'JavaScript', 'React', 'SvelteKit', 'Node', 'Hono', 'Express', 'HTML/CSS', 'PHP'],
  },
  {
    label: 'Data & Integrations',
    items: ['PostgreSQL', 'MongoDB', 'REST APIs', 'Stripe', 'Twilio', 'HubSpot', 'GoHighLevel', 'Close', 'Calendly'],
  },
  {
    label: 'Tools',
    items: ['Git', 'Claude Code', 'Cursor', 'Jira', 'Slack'],
  },
];
