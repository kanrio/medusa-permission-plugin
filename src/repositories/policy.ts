import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { Policy } from "../models/policy"

export const PolicyRepository = dataSource.getRepository(Policy).extend({})
export default PolicyRepository
