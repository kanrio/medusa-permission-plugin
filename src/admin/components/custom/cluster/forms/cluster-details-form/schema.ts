import * as z from "zod"

export const clusterDetailsSchema = z.object({
  general: z.object({
    name: z.string().nonempty({ message: "Name is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
  }),
})
