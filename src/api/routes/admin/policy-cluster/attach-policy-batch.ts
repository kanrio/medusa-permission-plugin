import { ArrayNotEmpty, IsString } from "class-validator"
import { Request, Response } from "express"
import PolicyClusterService from "../../../../services/policy-cluster"
import { EntityManager } from "typeorm"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const { validatedBody } = req as {
    validatedBody: AdminAttachPolicyFromPolicyClusterReq
  }

  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    return await policyClusterService
      .withTransaction(transactionManager)
      .attachPolicyClusterRelations(validatedBody.policy, id)
  })

  res.json({
    ids: validatedBody.policy,
    object: "policy-on-cluster",
    attachted: true,
  })
}

export class AdminAttachPolicyFromPolicyClusterReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  policy: string[]
}
