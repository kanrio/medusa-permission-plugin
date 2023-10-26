import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { defaultAdminPolicyClusterRelations } from "./index"
import PolicyClusterService from "../../../../services/policy-cluster"
import { PolicyArrayInputReq } from "../../../../types/policy-cluster"

export default async (req: Request, res: Response) => {
  const { validatedBody } = req as { validatedBody: AdminPolicyClusterReq }

  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const manager: EntityManager = req.scope.resolve("manager")

  const created = await manager.transaction(async (transactionManager) => {
    return await policyClusterService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  const policyCluster = await policyClusterService.retrieve(created.id, {
    relations: defaultAdminPolicyClusterRelations,
  })

  res.status(200).json({ policy_cluster: policyCluster })
}
// TODO: Correct validation requirement.
export class AdminPolicyClusterReq {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @IsArray()
  policy?: PolicyArrayInputReq[]

  @IsArray()
  user: string[]
}
