import * as z from "zod"

export const policySettingsSchema = z.object({
  settings: z.object({
    base_router: z
      .string()
      .nonempty({ message: "Base router is required" })
      .refine(
        (value) => {
          return /^[a-zA-Z0-9_-]+$/.test(value)
        },
        { message: "Base router should not include special characters" }
      ),
    method: z.enum(["GET", "POST", "DELETE", "PUT", "PATCH"]),
  }),
})
