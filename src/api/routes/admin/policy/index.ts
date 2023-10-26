import { Router } from "express"
import "reflect-metadata"
import { transformBody } from "@medusajs/medusa"
import { AdminGetPolicyParams } from "./list-policy"
import { AdminPolicyReq } from "./create-policy"
import { AdminPostPolicyReq } from "./update-policy"
import { transformQuery } from "@medusajs/medusa"

export default (app) => {
  const route = Router()
  app.use("/policy", route)

  route.post(
    "/",
    transformBody(AdminPolicyReq),
    require("./create-policy").default
  )

  route.get(
    "/",
    transformQuery(AdminGetPolicyParams, {
      isList: true,
    }),
    require("./list-policy").default
  )

  const policiesRouter = Router({ mergeParams: true })

  route.use("/:id", policiesRouter)

  policiesRouter.post(
    "/",
    transformBody(AdminPostPolicyReq),
    require("./update-policy").default
  )

  policiesRouter.delete("/", require("./delete-policy").default)

  policiesRouter.get("/", require("./get-policy").default)

  return app
}

export * from "./list-policy"
export * from "./create-policy"
export * from "./delete-policy"
export * from "./update-policy"
export * from "./get-policy"
