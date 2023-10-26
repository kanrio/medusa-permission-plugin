import cors from "cors"
import { Router } from "express"
import authenticate from "@medusajs/medusa/dist/api/middlewares/authenticate"
import { permissionMiddleware } from "./middlewares/permission-middleware"
import { errorHandler } from "@medusajs/medusa"

const router = Router()
export default function createPermissionMiddleware(
  adminConfiguration,
  excludeArray: string[]
) {
  const deAttachRegex = generateRegex(excludeArray)

  router.use(
    deAttachRegex,
    cors(adminConfiguration),
    authenticate(),
    permissionMiddleware,
    errorHandler()
  )

  return router
}

function generateRegex(excludeArray: string[]): RegExp {
  const exclusions = ["auth", "users", "invites", "analytics-configs"].concat(
    excludeArray
  )

  const lookahead = exclusions.map((route) => `(?!/${route}(/|$))`).join("")

  const regexString = `^/admin${lookahead}`

  return new RegExp(regexString)
}
