import PolicyClusterService from "../../../../services/policy-cluster"
import { ArrayNotEmpty, IsString } from "class-validator"
import { EntityManager } from "typeorm"

export default async (req, res) => {
  const { id } = req.params

  const { validatedBody } = req as {
    validatedBody: AdminDeletePolicyFromPolicyClusterReq
  }

  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    return await policyClusterService
      .withTransaction(transactionManager)
      .removePolicyClusterRelations(validatedBody.policy, id)
  })

  res.json({
    ids: validatedBody.policy,
    object: "policy-on-cluster",
    deleted: true,
  })
}

export class AdminDeletePolicyFromPolicyClusterReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  policy: string[]
}
