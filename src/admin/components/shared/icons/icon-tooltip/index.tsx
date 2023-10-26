import React from "react"
import { Tooltip } from "@medusajs/ui"
import IconProps from "../../../../types/icon-props"
import { TooltipProps } from "../../tooltip"
import {
  ExclamationCircle,
  XMarkMini,
  InformationCircle,
} from "@medusajs/icons"

type IconTooltipProps = TooltipProps & {
  type?: "info" | "warning" | "error"
} & Pick<IconProps, "size">

const IconTooltip: React.FC<IconTooltipProps> = ({
  type = "info",
  content,
  ...props
}) => {
  const icon = (type: IconTooltipProps["type"]) => {
    switch (type) {
      case "warning":
        return <ExclamationCircle className="text-orange-40 flex" />
      case "error":
        return <XMarkMini className="text-rose-40 flex" />
      default:
        return <InformationCircle className="text-grey-40 flex" />
    }
  }

  return (
    <Tooltip content={content} {...props}>
      {icon(type)}
    </Tooltip>
  )
}

export default IconTooltip
