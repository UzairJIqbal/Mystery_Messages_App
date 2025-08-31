import z from "zod";

export const verifySchema = z.object({
  code :  z.string().length(4 , "Verification must be four digits")
})
