import { z } from "zod";

export const planRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(500, "Prompt is too long"),
  goal: z.string().min(1, "Goal is required").max(120, "Goal is too long"),
  equipment: z.string().min(1, "Equipment is required").max(300, "Equipment is too long"),
});
