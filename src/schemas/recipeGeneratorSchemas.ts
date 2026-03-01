import { z } from "zod";

const RecipeInputSchema = z.object({
    ingredient: z.string().describe('Main ingredient or cuisine type'),
    dietaryRestrictions: z.string().optional().describe('Any dietary restrictions'),
});

// Define output schema
const RecipeSchema = z.object({
    title: z.string(),
    description: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    servings: z.number(),
    ingredients: z.array(z.string()),
    instructions: z.array(z.string()),
    tips: z.array(z.string()).optional(),
});

export { RecipeInputSchema, RecipeSchema };

