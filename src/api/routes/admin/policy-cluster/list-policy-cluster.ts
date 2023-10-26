import { IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"

import { Type } from "class-transformer"
import { DateComparisonOperator } from "@medusajs/medusa"
import PolicyClusterService from "../../../../services/policy-cluster"

export default async (req: Request, res: Response) => {
  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const { filterableFields, listConfig } = req
  const { skip, take } = listConfig

  const [policyClusters, count] = await policyClusterService.listAndCount(
    filterableFields,
    listConfig
  )

  res.status(200).json({
    policy_cluster: policyClusters,
    count,
    offset: skip,
    limit: take,
  })
}

// eslint-disable-next-line max-len
export class AdminGetPolicyClusterParams {
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
