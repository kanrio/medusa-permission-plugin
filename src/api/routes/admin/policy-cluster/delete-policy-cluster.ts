import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import PolicyClusterService from "../../../../services/policy-cluster"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await policyClusterService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id,
    object: "policy-cluster-object",
    deleted: true,
  })
}
