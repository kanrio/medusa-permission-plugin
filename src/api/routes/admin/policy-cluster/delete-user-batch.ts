import { Request, Response } from "express"
import { EntityManager } from "typeorm"
import UserService from "../../../../services/user"
import { ArrayNotEmpty, IsString } from "class-validator"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const { validatedBody } = req as {
    validatedBody: AdminDeleteUserFromPolicyClusterReq
  }

  const userService: UserService = req.scope.resolve("userService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await userService
      .withTransaction(transactionManager)
      .removeUserClusterRelations(validatedBody.users, id)
  })

  res.json({
    ids: validatedBody.users,
    object: "user-on-cluster",
    deleted: true,
  })
}

export class AdminDeleteUserFromPolicyClusterReq {
  @ArrayNotEmpty()
  @IsString({ each: true })
  users: string[]
}
