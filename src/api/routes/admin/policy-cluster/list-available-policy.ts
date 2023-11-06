import { IsOptional, IsString, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { DateComparisonOperator } from "@medusajs/medusa"
import { Request, Response } from "express"
import PolicyClusterService from "../../../../services/policy-cluster"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const { filterableFields, listConfig } = req

  const { skip, take } = listConfig

  const [policy, count] = await policyClusterService.fetchAvailablePolicies(
    filterableFields,
    listConfig,
    id
  )

  res.status(200).json({
    policy: policy,
    count,
    offset: skip,
    limit: take,
  })
}

// eslint-disable-next-line max-len
export class AdminGetPolicyClusterAvailablePolicyParams {
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
