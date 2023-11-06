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

type ListAndCountSelector = Selector<User> & {
  q?: string
}

export default class UserService extends MedusaUserService {
  static LIFETIME = Lifetime.SINGLETON

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
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
}
