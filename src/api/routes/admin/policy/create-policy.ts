import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import PolicyService from "../../../../services/policy"

export default async (req: Request, res: Response) => {
  const { validatedBody } = req as { validatedBody: AdminPolicyReq }

  const policyService: PolicyService = req.scope.resolve("policyService")

  const manager: EntityManager = req.scope.resolve("manager")

  const created = await manager.transaction(async (transactionManager) => {
    return await policyService
      .withTransaction(transactionManager)
      .create(validatedBody)
  })

  const policy = await policyService.retrieve(created.id, {})

  res.status(200).json({ policy: policy })
}
// TODO: Implement the validator
export class AdminPolicyReq {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  method: string

  @IsString()
  @IsNotEmpty()
  base_router: string
}
