import { Lifetime } from "awilix"
import {
  Selector,
  UserService as MedusaUserService,
  FindConfig,
  isString,
  buildQuery,
  ExtendedFindConfig,
} from "@medusajs/medusa"
import { User } from "../models/user"
import { FindManyOptions, FindOptionsWhere, ILike } from "typeorm"
import { Equal } from "typeorm"
import PolicyClusterService from "./policy-cluster"
import { isDefined, MedusaError } from "medusa-core-utils"

type ListAndCountSelector = Selector<User> & {
  q?: string
}

export default class UserService extends MedusaUserService {
  static LIFETIME = Lifetime.SINGLETON
  protected readonly policyClusterService_: typeof PolicyClusterService

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.policyClusterService_ = container.policyClusterService
  }

  async listAndCountCustom(
    selector: ListAndCountSelector = {},
    config: FindConfig<User> = { skip: 0, take: 20 }
  ): Promise<[User[], number]> {
    const manager = this.manager_
    const userRepository = manager.withRepository(this.userRepository_)

    let q

    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config) as FindManyOptions<User> & {
      where: {}
    } & ExtendedFindConfig<User>

    if (q) {
      const where = query.where as FindOptionsWhere<User>

      delete where.first_name
      delete where.last_name
      delete where.email
      delete where.created_at
      delete where.updated_at
      delete where.policy_cluster

      query.where = [
        {
          ...where,
          email: ILike(`%${q}%`),
        },
      ]
    }

    // @ts-ignore
    return await userRepository.findAndCount(query)
  }

  async listUsersOnPolicyCluster(
    selector: ListAndCountSelector = {},
    config: FindConfig<User> = { skip: 0, take: 20 },
    policyClusterId: string
  ): Promise<[User[], number]> {
    const manager = this.manager_
    const userRepository = manager.withRepository(this.userRepository_)

    let q

    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config) as FindManyOptions<User> & {
      where: {}
    } & ExtendedFindConfig<User>

    query.where = {
      ...query.where,
      policy_cluster: Equal(policyClusterId),
    }

    // @ts-ignore
    return await userRepository.findAndCount(query)
  }

  async removeUserClusterRelations(userIds: string[], policyClusterId: string) {
    if (!isDefined(policyClusterId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `"policyClusterId" must be defined`
      )
    }

    // TODO: It's slow to do this one by one
    // We need to do this in a batch
    return await this.atomicPhase_(async (manager) => {
      const userRepository = manager.withRepository(this.userRepository_)

      for (const userId of userIds) {
        const user = await userRepository.findOne({ where: { id: userId } })

        if (!user) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, `User not found`)
        }

        // TODO: Check policy cluster itself

        // @ts-ignore
        await userRepository.update(userId, { policy_cluster: null })
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(PolicyClusterService.Events.UPDATED, {})
    })
  }

  async attachUserPolicyClusterRelations(
    userIds: string[],
    policyClusterId: string
  ) {
    if (!isDefined(policyClusterId)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `"policyClusterId" must be defined`
      )
    }
    // TODO: Check if it's valid or not

    // TODO: It's slow to do this one by one
    // We need to do this in a batch
    return await this.atomicPhase_(async (manager) => {
      const userRepository = manager.withRepository(this.userRepository_)

      for (const userId of userIds) {
        const user = await userRepository.findOne({ where: { id: userId } })

        if (!user) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, `User not found`)
        }

        // @ts-ignore
        await userRepository.update(userId, { policy_cluster: policyClusterId })
      }

      await this.eventBus_
        .withTransaction(manager)
        .emit(PolicyClusterService.Events.UPDATED, {})
    })
  }
}
