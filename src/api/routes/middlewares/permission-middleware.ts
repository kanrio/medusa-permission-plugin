import { UserService } from "@medusajs/medusa"
import { User } from "../../../models/user"
import PermissionsService from "../../../services/permissions"
import { Request, Response, NextFunction } from "express"

export async function permissionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let loggedInUser: User | null = null

  if (req.user && req.user.userId) {
    const userService = req.scope.resolve("userService") as UserService
    // @ts-ignore
    loggedInUser = await userService.retrieve(req.user.userId, {
      relations: ["policy_cluster"],
    })
  }

  const permissionsService: PermissionsService = req.scope.resolve(
    "permissionsService"
  ) as PermissionsService

  await permissionsService.init()

  const wordsArray = req.path.split("/").filter(Boolean)

  if (!loggedInUser) {
    return res.status(401).json({ message: "Not allowed" })
  }

  const permission = permissionsService.checkPermission(
    loggedInUser.policy_cluster?.id,
    wordsArray[0],
    req.method
  )

  if (!permission) {
    return res.status(401).json({ message: "Not allowed" })
  }

  next()
}
