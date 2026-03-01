
import { RecipeInputSchema, RecipeSchema } from "../schemas/recipeGeneratorSchemas.ts";

import { ai } from "../libs/genkit.ts";

// Define a recipe generator flow
const recipeGeneratorFlow = ai.defineFlow(
    {
        name: 'recipeGeneratorFlow',
        inputSchema: RecipeInputSchema,
        outputSchema: RecipeSchema,
    },
    async (input) => {
        // Create a prompt based on the input
        const prompt = `Create a recipe with the following requirements:
      Main ingredient: ${input.ingredient}
      Dietary restrictions: ${input.dietaryRestrictions || 'none'}`;

        // Generate structured recipe data using the same schema
        const { output } = await ai.generate({
            system: 'Actúa como un chef Michelin. Tu tono es sofisticado y tus recetas son gourmet.',
            prompt,
            output: { schema: RecipeSchema },
        });

        if (!output) throw new Error('Failed to generate recipe');

        return output;
    },
);

// Run the flow
async function main() {
    const recipe = await recipeGeneratorFlow({
        ingredient: 'avocado',
        dietaryRestrictions: 'vegetarian',
    });

    console.log(recipe);
}

main().catch(console.error);

export { recipeGeneratorFlow };
