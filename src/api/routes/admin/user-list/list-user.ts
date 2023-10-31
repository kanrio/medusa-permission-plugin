import UserService from "../../../../services/user"
import { Request, Response } from "express"
import { IsOptional, IsString, ValidateNested, IsEmail } from "class-validator"
import { Type } from "class-transformer"
import { DateComparisonOperator } from "@medusajs/medusa"

export default async (req: Request, res: Response) => {
  const userService: UserService = req.scope.resolve("userService")

  const { filterableFields, listConfig } = req

  const { skip, take } = listConfig

  const [users, count] = await userService.listAndCountCustom(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    user: users,
    count,
    offset: skip,
    take: take,
  })
}

export class AdminGetUserParams {
  @IsOptional()
  @IsString()
  first_name?: string

  @IsOptional()
  @IsString()
  last_name?: string

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @Type(() => Number)
  limit = 10

  @IsOptional()
  @Type(() => Number)
  offset = 0
}
