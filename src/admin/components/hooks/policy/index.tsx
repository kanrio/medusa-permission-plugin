import {
  useAdminCustomQuery,
  useAdminCustomPost,
  useAdminCustomDelete,
} from "medusa-react"

export type Policy = {
  name: string
  description: string
  method: string
  base_router: string
  id: string
  created_at: string
  updated_at: string
}

export type AdminPolicyQuery = {
  expand?: string
  fields?: string
}

export type AdminListPolicyRes = {
  policy: Policy[]
  count: number
  offset: number
  limit: number
}

export type AdminPolicyRes = {
  policy: Policy
}

export type AdminPolicyReq = {
  name: string
  description: string
  method: string
  base_router: string
}

export type AdminPolicyDeleteReq = {
  id: string
  object: string
  deleted: boolean
}

type AdminPolicyQueryType = AdminPolicyQuery
type AdminPolicyResType = AdminListPolicyRes

export function useAdminPolicy(queryObject: any) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminPolicyQueryType,
    AdminPolicyResType
  >(`/policy`, ["admin-policy-list"], queryObject)

  return {
    data,
    isLoading,
    isRefetching,
    count: data?.count,
  }
}

export function mutateAdminPolicy() {
  const { mutate, isLoading, isError, isSuccess, isIdle, isPaused } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAdminCustomPost<AdminPolicyReq, AdminPolicyRes>(`/policy`, [
      "admin-policy-post",
    ])

  return {
    mutate,
    isLoading,
    isError,
    isSuccess,
    isIdle,
    isPaused,
  }
}

export function useAdminPolicyDelete(id: string) {
  const { mutate, isLoading, isError } =
    useAdminCustomDelete<AdminPolicyDeleteReq>(`/policy/${id}`, [
      "deleted-policy",
    ])

  return {
    mutate,
    isLoading,
    isError,
  }
}
