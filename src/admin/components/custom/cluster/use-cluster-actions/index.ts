import { ActionType } from "../../../shared/actionables/"
import { Cluster, useAdminPolicyClusterDelete } from "../../../hooks/cluster/"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"

const usePolicyClusterActions = (policyCluster: Cluster) => {
  const dialog = useImperativeDialog()
  const deleteCluserPolicy = useAdminPolicyClusterDelete(policyCluster?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Policy Cluster",
      text: "Are you sure you want to delete this policy cluster?",
    })

    if (shouldDelete) {
      deleteCluserPolicy.mutate()
    }
  }

  const getActions = (): ActionType[] => [
    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
      // FIXME: Icon is broken right now and I don't know why
    },
  ]

  return {
    getActions,
  }
}

export default usePolicyClusterActions
