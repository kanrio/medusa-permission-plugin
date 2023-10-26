import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { PolicyCluster } from "../models/policy-cluster"

export const PolicyClusterRepository = dataSource
  .getRepository(PolicyCluster)
  .extend({})
export default PolicyClusterRepository
