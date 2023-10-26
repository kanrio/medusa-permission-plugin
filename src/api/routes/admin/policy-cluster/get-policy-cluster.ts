import { Request, Response } from "express"
import { defaultAdminPolicyClusterRelations } from "./index"
import PolicyClusterService from "../../../../services/policy-cluster"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policyClusterService: PolicyClusterService = req.scope.resolve(
    "policyClusterService"
  )

  const policyCluster = await policyClusterService.retrieve(id, {
    relations: defaultAdminPolicyClusterRelations,
  })
  res.status(200).json({ policy_cluster: policyCluster })
}
