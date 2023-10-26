import * as z from "zod"
import { clusterPolicySchema } from "./schema"
export type ClusterPolicySchema = z.infer<typeof clusterPolicySchema>
