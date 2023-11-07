import { ArrayNotEmpty, IsString } from "class-validator"
import { Request, Response } from "express"
import UserService from "../../../../services/user"
import { EntityManager } from "typeorm"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const { validatedBody } = req as {
    validatedBody: AdminAttachUserFromPolicyClusterReq
  }

  const userService: UserService = req.scope.resolve("userService")

  const manager: EntityManager = req.scope.resolve("manager")

  await manager.transaction(async (transactionManager) => {
    return await userService
      .withTransaction(transactionManager)
      .attachUserPolicyClusterRelations(validatedBody.users, id)
  })

  res.json({
    ids: validatedBody.users,
    object: "user-on-cluster",
    attachted: true,
  })
}

export class AdminAttachUserFromPolicyClusterReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  users: string[]
}
