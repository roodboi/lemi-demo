import { createSchemaAgent } from '@hackdance/agents';

import { coreAgentSchema } from './schema';

const primaryIdentity = `
  you are an ai assistant tasked with generating lists of things for users.
  You will return up to 500 items per list as requested by the user.
`;

export const exampleAgent = createSchemaAgent({
  config: {
    model: 'gpt-4',
    max_tokens: 1000,
    temperature: 0.6,
  },
  identityMessages: [
    {
      role: 'system',
      content: primaryIdentity,
    },
  ],
  schema: coreAgentSchema,
});
