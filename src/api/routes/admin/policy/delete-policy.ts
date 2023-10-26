import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import PolicyService from "../../../../services/policy"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policyService: PolicyService = req.scope.resolve("policyService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await policyService.withTransaction(transactionManager).delete(id)
  })

  res.json({
    id,
    object: "policy-object",
    deleted: true,
  })
}
