import { IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { Type } from "class-transformer"
import { DateComparisonOperator } from "@medusajs/medusa"
import PolicyService from "../../../../services/policy"

export default async (req: Request, res: Response) => {
  const policyService: PolicyService = req.scope.resolve("policyService")

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [policies, count] = await policyService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    policy: policies,
    count,
    offset: skip,
    limit: take,
  })
}

// eslint-disable-next-line max-len
export class AdminGetPolicyParams {
  @IsOptional()
  @IsString()
  name?: string

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
