import * as z from "zod"
import { clusterDetailsSchema } from "./schema"

export type ClusterDetailsSchema = z.infer<typeof clusterDetailsSchema>
