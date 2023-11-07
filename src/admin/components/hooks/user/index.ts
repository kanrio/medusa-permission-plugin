import { User } from "@medusajs/medusa"
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react"

export type AdminClusterUserQuery = {
  expand?: string
  fields?: string
}

export type AdminListPolicyClusterUsers = {
  users: User[]
  count: number
  offset: number
  limit: number
}

export type AdminPolicyClusterUserDeleteBatchReq = {
  users: string[]
}

export type AdminPolicyClusterUserDeleteBatchRes = {
  ids: string
  object: string
  deleted: boolean
}

export function useAdminPolicyClusterUsers(id: string, queryObject: any) {
  const { data, isLoading, isError } = useAdminCustomQuery<
    AdminClusterUserQuery,
    AdminListPolicyClusterUsers
  >(
    `/policy-cluster/${id}/users`,
    ["list-users-of-policy-cluster-id", id],
    queryObject
  )

  return {
    data,
    isLoading,
    isError,
    count: data?.count,
  }
}

export function useAdminPolicyClusterUsersDeleteBatch(id: string) {
  const { mutate, isLoading, isError } = useAdminCustomPost<
    AdminPolicyClusterUserDeleteBatchReq,
    AdminPolicyClusterUserDeleteBatchRes
  >(`/policy-cluster/${id}/users/batch`, [
    "deleted-policy-cluster-policy-batch",
    id,
  ])

  return {
    mutate,
    isLoading,
    isError,
  }
}
