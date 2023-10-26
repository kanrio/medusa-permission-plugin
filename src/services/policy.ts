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
import PolicyRepository from "../repositories/policy"
import { Policy } from "../models/policy"
import { CreatePolicy, UpdatePolicy } from "../types/policy"
import { isDefined, MedusaError } from "medusa-core-utils"

type ListAndCountSelector = Selector<Policy> & {
  q?: string
}

export default class PolicyService extends TransactionBaseService {
  static LIFETIME = Lifetime.SINGLETON
  protected readonly policyRepository_: typeof PolicyRepository
  protected readonly eventBusService_: IEventBusService

  static readonly Events = {
    CREATED: "policy.created",
    UPDATED: "policy.updated",
    DELETED: "policy.deleted",
  }

  constructor(container) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.eventBusService_ = container.eventBusService
    this.policyRepository_ = container.policyRepository
  }

  async list(
    selector: Selector<Policy> & {
      q?: string
    } = {},
    config = { skip: 0, take: 20 }
  ): Promise<Policy[]> {
    const [policies] = await this.listAndCount(selector, config)
    return policies
  }

  async listAndCount(
    selector: ListAndCountSelector = {},
    config: FindConfig<Policy> = { skip: 0, take: 20 }
  ): Promise<[Policy[], number]> {
    const manager = this.activeManager_
    const policyRepository = manager.withRepository(this.policyRepository_)

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config) as FindManyOptions<Policy> & {
      where: {}
    } & ExtendedFindConfig<Policy>

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

    return await policyRepository.findAndCount(query)
  }

  async create(policiesDto: CreatePolicy): Promise<Policy> {
    return await this.atomicPhase_(async (manager) => {
      const policyRepository = manager.withRepository(this.policyRepository_)

      let policy = policyRepository.create(policiesDto)

      policy = await policyRepository.save(policy)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PolicyService.Events.CREATED, {})

      return policy
    })
  }

  async retrieve(policyId: string, config: FindConfig<Policy> = {}) {
    if (!isDefined(policyId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `"policyId" must be defined`
      )
    }

    const policyRepository = this.activeManager_.withRepository(
      this.policyRepository_
    )

    const query = buildQuery({ id: policyId }, config)

    const policy = await policyRepository.findOne(query)

    if (!policy) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Policy with id: ${policyId} was not found`
      )
    }
    return policy
  }

  async update(policyId: string, update: UpdatePolicy): Promise<Policy> {
    return await this.atomicPhase_(async (manager) => {
      const policyRepository = manager.withRepository(this.policyRepository_)

      let policy = await this.retrieve(policyId)

      for (const [key, value] of Object.entries(update)) {
        policy[key] = value
      }

      policy = await policyRepository.save(policy)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PolicyService.Events.UPDATED, {})

      return policy
    })
  }

  async delete(policyId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const policyRepository = manager.withRepository(this.policyRepository_)

      const policy = await this.retrieve(policyId)

      if (!policy) {
        return Promise.resolve()
      }

      await policyRepository.softRemove(policy)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PolicyService.Events.DELETED, {})

      return Promise.resolve()
    })
  }
}
