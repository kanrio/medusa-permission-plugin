import * as z from "zod"
import { clusterUsersSchema } from "./schema"
export type ClusterUsersSchema = z.infer<typeof clusterUsersSchema>
