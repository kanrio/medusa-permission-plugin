import { IsOptional } from "class-validator"
import { Request, Response } from "express"

import { Type } from "class-transformer"
import UserService from "../../../../services/user"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const userService: UserService = req.scope.resolve("userService")

  const { filterableFields, listConfig } = req

  const { skip, take } = listConfig

  const [users, count] = await userService.listUsersOnPolicyCluster(
    filterableFields,
    listConfig,
    id
  )

  res.status(200).json({
    users: users,
    count,
    offset: skip,
    limit: take,
  })
}

// eslint-disable-next-line max-len
export class AdminGetPolicyClusterUserParams {
  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsOptional()
  @Type(() => Number)
  offset = 0
}
