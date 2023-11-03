import {
  useAdminCustomPost,
  useAdminCustomQuery,
  useAdminCustomDelete,
} from "medusa-react"
import { Policy } from "../policy"

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

export type AdminListPolicyClusterPolicy = {
  policy_cluster: Policy[]
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

export type AdminPolicyClusterUpdateReq = {
  name?: string
  description?: string
  policy?: string[]
  user?: string[]
}

export type AdminPolicyClusterDeleteReq = {
  id: string
  object: string
  deleted: boolean
}

export type AdminPolicyClusterPolicyDeleteBatchReq = {
  policy: string[]
}

export type AdminPolicyClusterPolicyDeleteBatchRes = {
  ids: string
  object: string
  deleted: boolean
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

export function mutateClusterPolicyId(id: string) {
  const { mutate, isLoading, isError, isSuccess, isIdle, isPaused } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAdminCustomPost<AdminPolicyClusterUpdateReq, AdminPolicyClusterRes>(
      `/policy-cluster/${id}`,
      ["policy-cluster-post-update"]
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

export function useAdminPolicyClusterDelete(id: string) {
  const { mutate, isLoading, isError } =
    useAdminCustomDelete<AdminPolicyClusterDeleteReq>(`/policy-cluster/${id}`, [
      "deleted-policy-cluster",
    ])

  return {
    mutate,
    isLoading,
    isError,
  }
}

export function useAdminPolicyCluster(id: string) {
  const { data, isLoading, isError } = useAdminCustomQuery<
    AdminClusterQuery,
    AdminPolicyClusterRes
  >(`/policy-cluster/${id}`, ["policy-cluster-single", id])

  return {
    data,
    isLoading,
    isError,
  }
}

export function useAdminPolicyClusterPolicies(id: string) {
  const { data, isLoading, isError } = useAdminCustomQuery<
    AdminClusterQuery,
    AdminListPolicyClusterPolicy
  >(`/policy-cluster/${id}/policy`, ["policy-cluster-single-policy", id])

  return {
    data,
    isLoading,
    isError,
    count: data?.count,
  }
}

export function useAdminPolicyClusterDeletePolicy(id: string) {
  const { mutate, isLoading, isError } = useAdminCustomPost<
    AdminPolicyClusterPolicyDeleteBatchReq,
    AdminPolicyClusterPolicyDeleteBatchRes
  >(`/policy-cluster/${id}/policy/batch`, [
    "deleted-policy-cluster-policy-batch",
  ])

  return {
    mutate,
    isLoading,
    isError,
  }
}

export default useAdminClusters
