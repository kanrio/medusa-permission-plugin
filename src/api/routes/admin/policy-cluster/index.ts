import { Router } from "express"
import "reflect-metadata"
import { transformBody, transformQuery } from "@medusajs/medusa"
import { AdminGetPolicyClusterParams } from "./list-policy-cluster"
import { AdminPostPolicyClusterReq } from "./update-policy-cluster"
import { AdminPolicyClusterReq } from "./create-policy-cluster"

export default (app) => {
  const route = Router()
  app.use("/policy-cluster", route)

  route.post(
    "/",
    transformBody(AdminPolicyClusterReq),
    require("./create-policy-cluster").default
  )

  route.get(
    "/",
    transformQuery(AdminGetPolicyClusterParams, {
      defaultRelations: defaultAdminPolicyClusterRelations,
      isList: true,
    }),
    require("./list-policy-cluster").default
  )

  const policiesRouter = Router({ mergeParams: true })
  route.use("/:id", policiesRouter)

  policiesRouter.post(
    "/",
    transformBody(AdminPostPolicyClusterReq),
    require("./update-policy-cluster").default
  )

  policiesRouter.delete("/", require("./delete-policy-cluster").default)

  policiesRouter.get("/", require("./get-policy-cluster").default)

  return app
}
export const defaultAdminPolicyClusterRelations = []

export * from "./list-policy-cluster"
export * from "./create-policy-cluster"
export * from "./delete-policy-cluster"
export * from "./get-policy-cluster"
export * from "./update-policy-cluster"
