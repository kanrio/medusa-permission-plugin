import * as React from "react"
import { PolicyCluster } from "../../../../../../models/policy-cluster"
import { usePrompt, Container, Heading, Text } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { EditDetailsDrawer } from "./details-drawer"

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

  // FIXME: Some stuff
  // const { mutateAsync } = useAdminDeletePriceList(priceList.id)

  const onDelete = async () => {
    const name = policyCluster.name
    const confirmText = "Delete"
    const cancelText = "Cancel"

    const res = await prompt({
      title: "Delete Policy Cluster",
      description: `Are you sure you want to delete the price list ${name}?`,
      verificationText: name,
      confirmText,
      cancelText,
    })

    if (!res) {
      return
    }

    // mutate stuff
  }

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-y-1 pb-6">
          <div className="flex items-center justify-between">
            <Heading>{policyCluster?.name}</Heading>
            <div className="flex items-center gap-x-2">
              {/* <PriceListStatusMenu
                                priceListId={priceList.id}
                            status={priceList.status}
                            endsAt={priceList.ends_at}
                            startsAt={priceList.starts_at}
                            />
                            <PriceListMenu
                                onOpenDrawer={toggleDrawer}
                                onDelete={onDeletePriceList}
                            />*/}
            </div>
          </div>
          <Text>{policyCluster?.description}</Text>
        </div>
        <div className="small:grid-cols-2 medium:grid-cols-3 grid grid-cols-1 gap-6">
          <div className="border-ui-border-base flex flex-col gap-y-1 border-l px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {"Customer Groups"}
            </Text>
            {/* (priceList.customer_groups?.length ?? 0) > 0 ? (
                            <div className="flex items-center justify-between">
                                <Text size="large">
                                    {priceList.customer_groups
                                        .slice(0, 2)
                                        .map((cg) => cg.name)
                                        .join(", ")}
                                </Text>
                                {(priceList.customer_groups?.length || 0) > 2 && (
                                    <Tooltip
                                        content={
                                            <div className="flex flex-col">
                                                {priceList.customer_groups.slice(2).map((group) => {
                                                    return (
                                                        <Text size="small" key={group.id}>
                                                            {group.name}
                                                        </Text>
                                                    )
                                                })}
                                            </div>
                                        }
                                    >
                                        <Badge size="small" className="cursor-default">
                                            +{priceList.customer_groups.length - 2}
                                        </Badge>
                                    </Tooltip>
                                )}
                            </div>
                        ) : (
                            <Text size="large" className="text-ui-fg-muted">
                                -
                            </Text>
                        )*/}
          </div>
          <div className="border-ui-border-base flex flex-col gap-y-1 border-l px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {"Last edited"}
            </Text>
            <Text size="large">
              {format(new Date(policyCluster.updated_at), "EEE d, MMM yyyy")}
            </Text>
          </div>
          <div className="border-ui-border-base flex flex-col gap-y-1 border-l px-4">
            <Text size="base" className="text-ui-fg-subtle">
              {"Prices"}
            </Text>
            {/* <Text size="large">{priceList.prices.length ?? 0}</Text>*/}
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
