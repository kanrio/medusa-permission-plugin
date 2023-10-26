import * as z from "zod"
export const clusterPolicySchema = z.object({
  ids: z.string().array().min(1, {
    message: "At least one policy must be selected",
  }),
})
