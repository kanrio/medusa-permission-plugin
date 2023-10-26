import { Request, Response } from "express"
import PolicyService from "../../../../services/policy"

export default async (req: Request, res: Response) => {
  const { id } = req.params

  const policyService: PolicyService = req.scope.resolve("policyService")

  const policy = await policyService.retrieve(id, {})
  res.status(200).json({ policy })
}
