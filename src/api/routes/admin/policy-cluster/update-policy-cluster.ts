import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import { defaultAdminPolicyClusterRelations } from "."
import PolicyClusterService from "../../../../services/policy-cluster"
import { Type } from "class-transformer"
import { PolicyArrayInputReq } from "../../../../types/policy-cluster"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostPolicyClusterReq
  }

  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const updated = await manager.transaction(async (transactionManager) => {
    return await policyClusterService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  const policyCluster = await policyClusterService.retrieve(updated.id, {
    relations: defaultAdminPolicyClusterRelations,
  })

  res.status(200).json({ policy_cluster: policyCluster })
}
export class AdminPostPolicyClusterReq {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsOptional()
  @Type(() => PolicyArrayInputReq)
  @ValidateNested({ each: true })
  @IsArray()
  policy?: PolicyArrayInputReq[]
}
