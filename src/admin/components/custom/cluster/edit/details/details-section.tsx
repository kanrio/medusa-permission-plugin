import * as React from "react"
import { PolicyCluster } from "../../../../../../models/policy-cluster"
import {
  usePrompt,
  Container,
  Heading,
  Text,
  DropdownMenu,
  IconButton,
} from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { EditDetailsDrawer } from "./details-drawer"
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { useAdminPolicyClusterDelete } from "../../../../hooks/cluster"

type PolicyClusterDetailsSectionProps = {
  policyCluster: PolicyCluster
}

export const PolicyClusterDetailsSection = ({
  policyCluster,
}: PolicyClusterDetailsSectionProps) => {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const prompt = usePrompt()

  const navigate = useNavigate()

  const { mutate, isError, isLoading } = useAdminPolicyClusterDelete(
    policyCluster?.id
  )

  const onDelete = async () => {
    const name = policyCluster.name
    const confirmText = "Delete"
    const cancelText = "Cancel"

    const res = await prompt({
      title: "Delete Policy Cluster",
      description: `Are you sure you want to delete the policy cluster ${name}?`,
      verificationText: name,
      confirmText,
      cancelText,
    })

    if (!res) {
      return
    }

    mutate(undefined, {
      onSuccess: () => {
        // TODO: Notification
        navigate("/a/cluster", { replace: true })
      },
      onError: () => {
        // TODO: Notification
      },
    })
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-y-1 pb-6">
          <div className="flex items-center justify-between">
            <Heading>{policyCluster?.name}</Heading>
            <div className="flex items-center gap-x-2">
              <PolicyClusterMenu
                onOpenDrawer={toggleDrawer}
                onDelete={onDelete}
              />
            </div>
          </div>
          <Text>{policyCluster?.description}</Text>
        </div>
        <div className="small:grid-cols-2 medium:grid-cols-3 grid grid-cols-1 gap-6">
          <div className="border-ui-border-base flex flex-col gap-y-1 border-l px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {"Last Edited"}
            </Text>
            <Text size="large">
              {format(new Date(policyCluster?.updated_at), "EEE d, MMM yyyy")}
            </Text>
          </div>
          <div className="border-ui-border-base flex flex-col gap-y-1 border-l px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {"Created At"}
            </Text>
            <Text size="large">
              {format(new Date(policyCluster?.created_at), "EEE d, MMM yyyy")}
            </Text>
          </div>
        </div>
      </Container>
      <EditDetailsDrawer
        onOpenChange={setOpen}
        open={open}
        policyCluster={policyCluster}
      />
    </div>
  )
}

type PolicyClusterMenuProps = {
  onDelete: () => Promise<void>
  onOpenDrawer: () => void
}

const PolicyClusterMenu = ({
  onDelete,
  onOpenDrawer,
}: PolicyClusterMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" side="bottom">
        <DropdownMenu.Item onClick={onOpenDrawer}>
          <PencilSquare className="text-ui-fg-subtle" />
          <span className="ml-2">{"Edit details"}</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onDelete}>
          <Trash className="text-ui-fg-subtle" />
          <span className="ml-2">{"Delete"}</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
