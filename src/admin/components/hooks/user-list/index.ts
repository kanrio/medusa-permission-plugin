import { Cluster } from "../cluster"
import { useAdminCustomQuery } from "medusa-react"

export type User = {
  policy_cluster: Cluster
  id: string
  created_at: string
  updated_at: string
  deleted_at: string
  role: string
  email: string
  first_name: string
  last_name: string
  api_token: string
}

export type AdminUserQuery = {
  expand?: string
  fields?: string
}

export type AdminListUserRes = {
  user: User[]
  count: number
  offset: number
  limit: number
}

export function useAdminUserList(queryObject: any) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminUserQuery,
    AdminListUserRes
  >(`user-list`, ["admin-user-list-custom"], queryObject)

  return {
    data,
    isLoading,
    isRefetching,
    count: data?.count,
  }
}
