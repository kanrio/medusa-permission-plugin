import * as z from "zod"
import { policySettingsSchema } from "./schema"
export type PolicySettingsSchema = z.infer<typeof policySettingsSchema>
