import * as z from "zod"
import { policyDetailsSchema } from "./schema"
export type PolicyDetailsSchema = z.infer<typeof policyDetailsSchema>
