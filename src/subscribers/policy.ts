import { EntityManager } from "typeorm"
import { IEventBusService } from "@medusajs/types"
import PolicyService from "../services/policy"
import PermissionsService from "../services/permissions"
import PolicyClusterService from "../services/policy-cluster"

export default class MySubscriber {
  protected readonly manager_: EntityManager
  protected readonly policyService_: PolicyService
  protected readonly permissionsService_: PermissionsService
  protected readonly policyClusterService_: PolicyClusterService

  constructor({
    manager,
    eventBusService,
    policyService,
    permissionsService,
    policyClusterService,
  }: {
    manager: EntityManager
    eventBusService: IEventBusService
    policyService: PolicyService
    permissionsService: PermissionsService
    policyClusterService: PolicyClusterService
  }) {
    this.manager_ = manager
    this.policyService_ = policyService
    this.permissionsService_ = permissionsService
    this.policyClusterService_ = policyClusterService
    eventBusService.subscribe(
      PolicyService.Events.CREATED,
      this.handleHashmapCache
    )
    eventBusService.subscribe(
      PolicyService.Events.DELETED,
      this.handleHashmapCache
    )
    eventBusService.subscribe(
      PolicyService.Events.UPDATED,
      this.handleHashmapCache
    )
    eventBusService.subscribe(
      PolicyClusterService.Events.CREATED,
      this.handleHashmapCache
    )
    eventBusService.subscribe(
      PolicyClusterService.Events.UPDATED,
      this.handleHashmapCache
    )
    eventBusService.subscribe(
      PolicyClusterService.Events.DELETED,
      this.handleHashmapCache
    )
  }

  handleHashmapCache = async (): Promise<any> => {
    await this.permissionsService_.createPolicyHashmap()
  }
}
