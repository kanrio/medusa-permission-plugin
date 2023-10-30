import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsIn,
} from "class-validator"
import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import PolicyService from "../../../../services/policy"

export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostPolicyReq
  }

  const policyService: PolicyService = req.scope.resolve("policyService")

  const manager: EntityManager = req.scope.resolve("manager")
  const updated = await manager.transaction(async (transactionManager) => {
    return await policyService
      .withTransaction(transactionManager)
      .update(id, validatedBody)
  })

  const policy = await policyService.retrieve(updated.id, {})

  res.status(200).json({ policy })
}

export class AdminPostPolicyReq {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsIn(["GET", "POST", "DELETE", "PUT", "PATCH"])
  method?: string

  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: "Base router is required" })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: "Base router should not include special characters",
  })
  base_router?: string
}
