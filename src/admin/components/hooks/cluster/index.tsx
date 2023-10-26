import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react"

export type Cluster = {
  name: string
  description: string
  id: string
  created_at: string
  updated_at: string
}

export type AdminClusterQuery = {
  expand?: string
  fields?: string
}

export type AdminListPolicyClusterRes = {
  policy_cluster: Cluster[]
  count: number
  offset: number
  limit: number
}

export type AdminPolicyClusterRes = {
  policy_cluster: Cluster
}

export type AdminPolicyClusterReq = {
  name: string
  description: string
  policy: string[]
  user: string[]
}

function useAdminClusters(queryObject: any) {
  const { data, isLoading, isRefetching } = useAdminCustomQuery<
    AdminClusterQuery,
    AdminListPolicyClusterRes
  >(`/policy-cluster`, ["admin-policy-cluster-list"], queryObject)

  return {
    data,
    isLoading,
    isRefetching,
    count: data?.count,
  }
}

export function mutateClusterPolicy() {
  const { mutate, isLoading, isError, isSuccess, isIdle, isPaused } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAdminCustomPost<AdminPolicyClusterReq, AdminPolicyClusterRes>(
      `/policy-cluster`,
      ["policy-cluster-post"]
    )

  return {
    mutate,
    isLoading,
    isError,
    isSuccess,
    isIdle,
    isPaused,
  }
}

export default useAdminClusters
