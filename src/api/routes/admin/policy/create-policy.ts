import {
  IsNotEmpty,
  IsString,
  IsIn,
  Matches,
} from "class-validator"
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

export class AdminPolicyReq {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  description?: string

  @IsString()
  @IsNotEmpty()
  @IsIn(["GET", "POST", "DELETE", "PUT", "PATCH"])
  method: string

  @IsString()
  @IsNotEmpty({ message: "Base router is required" })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: "Base router should not include special characters",
  })
  base_router: string
}
