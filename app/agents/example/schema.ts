import z from 'zod';

export const coreAgentSchema = z.object({
  content: z.string({
    description: 'The content of the message to the user.',
  }),
  list: z
    .array(z.string())
    .describe('a list of strings requested by the user up to 500 items long.'),
});
