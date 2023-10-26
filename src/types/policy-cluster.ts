import { IsString } from "class-validator"

export declare type CreatePolicyCluster = {
  name: string
  description?: string
  policy?: PolicyArrayInput[] | null
  user?: string[] | null
}

export type PolicyArrayInput = {
  id: string
}

export class PolicyArrayInputReq {
  @IsString()
  id: string
}

export type UpdatePolicyCluster = Partial<CreatePolicyCluster>
