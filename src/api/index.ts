import configLoader from "@medusajs/medusa/dist/loaders/config"
import createPermissionMiddleware from "./routes"
import { getAdminRouter } from "./routes/admin"
import { ConfigModule } from "@medusajs/types"

export default function (rootDirectory: string) {
  const config = configLoader(rootDirectory)

  const adminCors = {
    origin: config.projectConfig.admin_cors.split(","),
    credentials: true,
  }

  const permissionRouter = getAdminRouter(adminCors)
  const pluginExcludeRouters = parseOptions(config)
  const defaultRouters = [
    permissionRouter,
    createPermissionMiddleware(adminCors, pluginExcludeRouters),
  ]

  return [...defaultRouters]
}

// TODO: Fix this bad code
function parseOptions(config: ConfigModule): string[] {
  for (const plugin of config.plugins) {
    if (typeof plugin === "string" && plugin === "medusa-permission-plugin") {
      return []
    } else if (
      typeof plugin === "object" &&
      plugin.resolve === "medusa-permission-plugin"
    ) {
      const options = plugin.options
      if (
        options &&
        typeof options === "object" &&
        Array.isArray(options.excludeArray)
      ) {
        const cleanedArray: string[] = []

        for (const item of options.excludeArray as any[]) {
          if (typeof item === "string") {
            const cleanedItem = item.trim().replace(/[^a-zA-Z0-9 ]/g, "") // Removing special characters except space

            if (cleanedItem.length > 0) {
              cleanedArray.push(cleanedItem)
            } else {
              console.info(
                `INFO[medusa-permission-plugin]: String "${item}" became empty after processing.`
              )
            }
          } else {
            console.info(
              `INFO[medusa-permission-plugin]: Unexpected item of type "${typeof item}" found.`
            )
          }
        }

        return cleanedArray
      }
    }
  }
  return [] // Default return value
}
