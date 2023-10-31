import { ActionType } from "src/admin/components/shared/actionables"
import { Policy, useAdminPolicyDelete } from "../../../hooks/policy"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import { Trash } from "@medusajs/icons"

const usePolicyActions = (policy: Policy) => {
  const dialog = useImperativeDialog()
  const deletePolicy = useAdminPolicyDelete(policy?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Policy",
      text: "Are you sure you want to delete this policy?",
    })

    if (shouldDelete) {
      deletePolicy.mutate()
    }
  }

  const getActions = (): ActionType[] => [
    {
      label: "Delete",
      variant: "danger",
      onClick: handleDelete,
      icon: <Trash />,
    },
  ]

  return {
    getActions,
  }
}

export default usePolicyActions
