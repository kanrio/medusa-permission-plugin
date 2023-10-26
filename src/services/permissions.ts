import { Lifetime } from "awilix"
import { TransactionBaseService } from "@medusajs/medusa"
import { Policy } from "../models/policy"
import PolicyClusterRepository from "../repositories/policy-cluster"

export default class PermissionsService extends TransactionBaseService {
  static LIFETIME = Lifetime.SINGLETON
  protected readonly policyClusterRepository_: typeof PolicyClusterRepository
  private _policiesHashmap: Map<string, Policy[]>
  private _initialized = false

  constructor(container) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.policyClusterRepository_ = container.policyClusterRepository
    this._policiesHashmap = new Map<string, Policy[]>()
  }

  async init(): Promise<void> {
    if (this._initialized) {
      return
    }

    try {
      await this.createPolicyHashmap()
      this._initialized = true
    } catch (err) {
      console.error(`Cluster Hashmap creation error: ${err}`)
    }
  }

  async createPolicyHashmap(): Promise<void> {
    const clusterIdMap = new Map<string, Policy[]>()

    const policyClusterRepository = this.activeManager_.withRepository(
      this.policyClusterRepository_
    )

    const clusters = await policyClusterRepository.find({
      relations: ["policy"],
    })

    clusters.forEach((cluster) => {
      clusterIdMap.set(cluster.id, cluster.policy)
    })

    this._policiesHashmap = clusterIdMap
  }

  checkPermission(
    clusterId: string,
    baseRouter: string,
    reqMethod: string
  ): boolean {
    if (!clusterId) {
      return false
    }

    const hashedCluster = this._policiesHashmap.get(clusterId)
    if (hashedCluster) {
      return hashedCluster.some(
        (policy) =>
          policy.base_router === baseRouter && policy.method === reqMethod
      )
    }

    return false
  }
}
