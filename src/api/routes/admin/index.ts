import cors from "cors"
import { Router } from "express"
import bodyParser from "body-parser"
import getPolicyRouter from "./policy"
import getPolicyClusterRouter from "./policy-cluster"
import { errorHandler } from "@medusajs/medusa"
import getUserListRouter from "./user-list"

const adminRouter = Router()

export function getAdminRouter(adminCorsOptions): Router {
  adminRouter.use(cors(adminCorsOptions), bodyParser.json())

  const policyRouter = getPolicyRouter(adminRouter)
  const policyClusterRouter = getPolicyClusterRouter(adminRouter)
  const userListRouter = getUserListRouter(adminRouter)

  adminRouter.use(
    "/admin/",
    policyRouter,
    policyClusterRouter,
    userListRouter,
    errorHandler()
  )

  return adminRouter
}
