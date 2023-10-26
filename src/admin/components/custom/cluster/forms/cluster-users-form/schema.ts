import * as z from "zod"

export const clusterUsersSchema = z.object({
  ids: z.string().array().min(1, {
    message: "At least one user must be selected",
  }),
})
