import { Lifetime } from "awilix"
import {
  buildQuery,
  ExtendedFindConfig,
  FindConfig,
  isString,
  Selector,
  TransactionBaseService,
} from "@medusajs/medusa"
import { FindManyOptions, FindOptionsWhere, ILike } from "typeorm"
import { IEventBusService } from "@medusajs/types"
import { Policy } from "../models/policy"
import { isDefined, MedusaError } from "medusa-core-utils"
import PolicyClusterRepository from "../repositories/policy-cluster"
import {
  CreatePolicyCluster,
  UpdatePolicyCluster,
} from "../types/policy-cluster"
import { User } from "../models/user"
import { PolicyCluster } from "../models/policy-cluster"
import PolicyRepository from "../repositories/policy"

type ListAndCountSelector = Selector<PolicyCluster> & {
  q?: string
}

export default class PolicyClusterService extends TransactionBaseService {
  static LIFETIME = Lifetime.SINGLETON
  protected readonly policyClusterRepository_: typeof PolicyClusterRepository
  protected readonly eventBusService_: IEventBusService
  protected readonly policyRepository_: typeof PolicyRepository

  static readonly Events = {
    CREATED: "policy-cluster.created",
    UPDATED: "policy-cluster.updated",
    DELETED: "policy-cluster.deleted",
  }

  constructor(container) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.eventBusService_ = container.eventBusService
    this.policyClusterRepository_ = container.policyClusterRepository
    this.policyRepository_ = container.policyRepository
  }

  async list(
    selector: Selector<PolicyCluster> & {
      q?: string
    } = {},
    config = { skip: 0, take: 20 }
  ): Promise<PolicyCluster[]> {
    const [policyClusters] = await this.listAndCount(selector, config)
    return policyClusters
  }

  async listAndCount(
    selector: ListAndCountSelector = {},
    config: FindConfig<PolicyCluster> = { skip: 0, take: 20 }
  ): Promise<[PolicyCluster[], number]> {
    const manager = this.activeManager_
    const policyClusterRepository = manager.withRepository(
      this.policyClusterRepository_
    )

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(
      selector,
      config
    ) as FindManyOptions<PolicyCluster> & {
      where: {}
    } & ExtendedFindConfig<PolicyCluster>

    if (q) {
      const where = query.where as FindOptionsWhere<PolicyCluster>

      delete where.name
      delete where.created_at
      delete where.updated_at

      query.where = [
        {
          ...where,
          name: ILike(`%${q}%`),
        },
      ]
    }

    return await policyClusterRepository.findAndCount(query)
  }

  async create(policyClusterDto: CreatePolicyCluster): Promise<PolicyCluster> {
    return await this.atomicPhase_(async (manager) => {
      const policyClusterRepository = manager.withRepository(
        this.policyClusterRepository_
      )

      const { policy: policies, user, ...rest } = policyClusterDto

      let policyCluster = policyClusterRepository.create(rest)

      if (isDefined(policies)) {
        policyCluster.policy = []

        if (policies?.length) {
          const policyIds = policies.map((policy) => policy.id)
          policyCluster.policy = policyIds.map((id) => ({ id }) as Policy)
        }
      }

      if (isDefined(user)) {
        policyCluster.user = []

        if (user?.length) {
          const userIds = user.map((user) => user)
          policyCluster.user = userIds.map((id) => ({ id }) as User)
        }
      }

      policyCluster = await policyClusterRepository.save(policyCluster)

      const result = await this.retrieve(policyCluster.id)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PolicyClusterService.Events.CREATED, {})

      return result
    })
  }

  async retrieve(
    policyClusterId: string,
    config: FindConfig<PolicyCluster> = {}
  ) {
    if (!isDefined(policyClusterId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `"policyClusterId" must be defined`
      )
    }

    const policyClusterRepository = this.activeManager_.withRepository(
      this.policyClusterRepository_
    )

    const query = buildQuery({ id: policyClusterId }, config)

    const policyCluster = await policyClusterRepository.findOne(query)

    if (!policyCluster) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Policy cluster with id: ${policyClusterId} was not found`
      )
    }
    return policyCluster
  }

  async update(
    policyClusterId: string,
    update: UpdatePolicyCluster
  ): Promise<PolicyCluster> {
    return await this.atomicPhase_(async (manager) => {
      const policyClusterRepository = manager.withRepository(
        this.policyClusterRepository_
      )

      const policyCluster = await this.retrieve(policyClusterId)

      const { policy: policies, ...rest } = update

      if (isDefined(policies)) {
        policyCluster.policy = []

        if (policies?.length) {
          const policyIds = policies.map((c) => c.id)
          policyCluster.policy = policyIds.map((id) => ({ id }) as Policy)
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        policyCluster[key] = value
      }

      const result = await policyClusterRepository.save(policyCluster)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PolicyClusterService.Events.UPDATED, {})

      return result
    })
  }

  async delete(policyClusterId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const policyClusterRepository = manager.withRepository(
        this.policyClusterRepository_
      )

      const policyCluster = await this.retrieve(policyClusterId)

      if (!policyCluster) {
        return Promise.resolve()
      }

      await policyClusterRepository.softRemove(policyCluster)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PolicyClusterService.Events.DELETED, {})

      return Promise.resolve()
    })
  }

  async listPolicy(
    selector: ListAndCountSelector = {},
    config: FindConfig<Policy> = { skip: 0, take: 20 },
    policyClusterId: string
  ): Promise<[Policy[], number]> {
    if (!isDefined(policyClusterId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `"policyClusterId" must be defined`
      )
    }

    const policyClusterRepository = this.activeManager_.withRepository(
      this.policyClusterRepository_
    )

    const query = buildQuery({ id: policyClusterId }, config)

    const policyCluster = await policyClusterRepository.findOne(query)

    if (!policyCluster) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Policy cluster with id: ${policyClusterId} was not found`
      )
    }

    const policyRepository = this.activeManager_.withRepository(
      this.policyRepository_
    )

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    if (q) {
      const where = query.where as FindOptionsWhere<Policy>

      delete where.name
      delete where.created_at
      delete where.updated_at

      query.where = [
        {
          ...where,
          name: ILike(`%${q}%`),
        },
      ]
    }

    const order: Record<string, string> = {}

    if (typeof config.order === "string") {
      order[`policy.${config.order}`] = "ASC"
    } else {
      for (const [key, value] of Object.entries(config.order)) {
        order[`policy.${key}`] = value
      }
    }

    const policies = await policyRepository
      .createQueryBuilder("policy")
      .innerJoin("policy_cluster_policy", "pcp", "pcp.policyId = policy.id")
      .where("pcp.policyClusterId = :policyClusterId", { policyClusterId })
      .skip(config.skip)
      .take(config.take)
      // @ts-ignore
      .orderBy(order)
      .getMany()

    const count = await policyRepository
      .createQueryBuilder("policy")
      .innerJoin("policy_cluster_policy", "pcp", "pcp.policyId = policy.id")
      .where("pcp.policyClusterId = :policyClusterId", { policyClusterId })
      .getCount()

    return [policies, count]
  }

  async removePolicyClusterRelations(
    policyIds: string[],
    policyClusterId: string
  ) {
    return await this.atomicPhase_(async (manager) => {
      const policyRepository = manager.withRepository(this.policyRepository_)

      for (const policy of policyIds) {
        await policyRepository
          .createQueryBuilder()
          .delete()
          .from("policy_cluster_policy")
          .where(
            "policyId = :policyId and policyClusterId = :policyClusterId",
            {
              policyId: policy,
              policyClusterId: policyClusterId,
            }
          )
          .execute()
      }
    })
  }
}
