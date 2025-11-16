'use server';

/**
 * @fileOverview Generates a product listing description based on a short prompt.
 *
 * - generateProductListingDescription - A function that generates the product listing description.
 * - GenerateProductListingDescriptionInput - The input type for the generateProductListingDescription function.
 * - GenerateProductListingDescriptionOutput - The return type for the generateProductListingDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductListingDescriptionInputSchema = z.object({
  prompt: z
    .string()
    .describe('A short prompt describing the product to be listed.'),
});
export type GenerateProductListingDescriptionInput = z.infer<
  typeof GenerateProductListingDescriptionInputSchema
>;

const GenerateProductListingDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('A detailed product description generated from the prompt.'),
});
export type GenerateProductListingDescriptionOutput = z.infer<
  typeof GenerateProductListingDescriptionOutputSchema
>;

export async function generateProductListingDescription(
  input: GenerateProductListingDescriptionInput
): Promise<GenerateProductListingDescriptionOutput> {
  return generateProductListingDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductListingDescriptionPrompt',
  input: {schema: GenerateProductListingDescriptionInputSchema},
  output: {schema: GenerateProductListingDescriptionOutputSchema},
  prompt: `You are an expert at writing product descriptions for e-commerce websites. Based on the following prompt, write a compelling and detailed product description.

Prompt: {{{prompt}}}`,
});

const generateProductListingDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductListingDescriptionFlow',
    inputSchema: GenerateProductListingDescriptionInputSchema,
    outputSchema: GenerateProductListingDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
