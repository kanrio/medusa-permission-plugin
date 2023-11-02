import { PolicyCluster } from "../../../../../../models/policy-cluster"
import {
  ClusterDetailsSchema,
  ClusterDetailsForm,
} from "../../forms/cluster-details-form/"
import { useForm } from "react-hook-form"
import React from "react"
import { usePrompt, Drawer, Button } from "@medusajs/ui"
import { Form } from "../../../../shared/form/"
import { nestedForm } from "../../../../shared/form/nested-form/"
import { mutateClusterPolicyId } from "../../../../hooks/cluster"

type PolicyClusterListDetailsDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  policyCluster: PolicyCluster
}

type PolicyClusterDetailsFormValues = {
  details: ClusterDetailsSchema
}

const PolicyClusterDetailsDrawer = ({
  open,
  onOpenChange,
  policyCluster,
}: PolicyClusterListDetailsDrawerProps) => {
  const { mutate, isError, isIdle, isLoading, isPaused, isSuccess } =
    mutateClusterPolicyId(policyCluster?.id)

  const form = useForm<PolicyClusterDetailsFormValues>({
    defaultValues: getDefaultValues(policyCluster),
  })

  const {
    reset,
    formState: { isDirty },
    handleSubmit,
  } = form

  React.useEffect(() => {
    if (open) {
      reset(getDefaultValues(policyCluster))
    }
  }, [policyCluster, open, reset])

  const prompt = usePrompt()

  const onStateChange = React.useCallback(
    async (open: boolean) => {
      if (isDirty) {
        const response = await prompt({
          title: "Are you sure?",
          description:
            "You have unsaved changes, are you sure you want to exit?",
        })

        if (!response) {
          onOpenChange(true)
          return
        }
      }

      reset()
      onOpenChange(open)
    },
    [isDirty, reset, prompt, onOpenChange]
  )

  const onSubmit = handleSubmit(async (values) => {
    mutate(
      {
        name: values.details.general.name,
        description: values.details.general.description,
      },
      {
        onSuccess: () => {
          // TODO: Notification

          onOpenChange(false)
        },
        onError: (err) => {
          // TODO: Notification
        },
      }
    )
  })

  return (
    <Drawer open={open} onOpenChange={onStateChange}>
      <Form {...form}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{"Edit Policy Cluster Details"}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="overflow-y-auto">
            <ClusterDetailsForm
              form={nestedForm(form, "details")}
              layout="drawer"
            />
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary">{"Cancel"}</Button>
            </Drawer.Close>
            <Button onClick={onSubmit} isLoading={false}>
              {"Save"}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Form>
    </Drawer>
  )
}

const getDefaultValues = (
  policyCluster: PolicyCluster
): PolicyClusterDetailsFormValues => {
  return {
    details: {
      general: {
        name: policyCluster.name,
        description: policyCluster.description,
      },
    },
  }
}
export { PolicyClusterDetailsDrawer as EditDetailsDrawer }
