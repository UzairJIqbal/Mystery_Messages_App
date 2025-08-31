import z from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(5, "content must me at least 5 characters")
    .max(500, "content must be no longer then 500 characters "),
});
