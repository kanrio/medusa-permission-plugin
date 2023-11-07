import { ActionType } from "../../../shared/actionables"
import { Cluster, useAdminPolicyClusterDelete } from "../../../hooks/cluster"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import { useNavigate } from "react-router-dom"
import { Trash } from "@medusajs/icons"
import EditIcon from "../../../../components/shared/icons/edit-icon"

const usePolicyClusterActions = (policyCluster: Cluster) => {
  const dialog = useImperativeDialog()
  const deleteCluserPolicy = useAdminPolicyClusterDelete(policyCluster?.id)
  const navigate = useNavigate()

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
      label: "Edit",
      onClick: () => navigate(`/a/cluster/${policyCluster.id}`),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
      icon: <Trash />,
      // TODO: Notifications
    },
  ]

  return {
    getActions,
  }
}

export default usePolicyClusterActions
