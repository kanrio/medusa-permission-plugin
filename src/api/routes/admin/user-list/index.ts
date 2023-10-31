import { transformQuery } from "@medusajs/medusa"
import { Router } from "express"
import { AdminGetUserParams } from "./list-user"

export default (app) => {
  const route = Router()

  app.use("/user-list", route)

  route.get(
    "/",
    transformQuery(AdminGetUserParams, {
      defaultRelations: ["policy_cluster"],
      isList: true,
    }),
    require("./list-user").default
  )

  return app
}

export * from "./list-user"
