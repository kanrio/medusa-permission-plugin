import { PolicyCluster } from "../../../../../../models/policy-cluster"
import * as z from "zod"
import {
  clusterPolicySchema,
  ClusterPolicyForm,
} from "../../forms/cluster-policy-form"
import * as React from "react"
import {
  Button,
  FocusModal,
  ProgressStatus,
  ProgressTabs,
  usePrompt,
  Text,
} from "@medusajs/ui"
import { zodResolver } from "@hookform/resolvers/zod"
import { Policy } from "../../../../../../models/policy"
import { useForm } from "react-hook-form"
import { Form } from "../../../../shared/form/index"
import { nestedForm } from "../../../../shared/form/nested-form"
import { ExclamationCircle, Spinner } from "@medusajs/icons"

type AddPolicyModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  policyCluster: PolicyCluster
  policyIds: string[]
}

enum Tab {
  POLICY = "policy",
  EDIT = "edit",
}

const addPolicySchema = z.object({
  policy: clusterPolicySchema,
})

type AddPolicyFormValue = z.infer<typeof addPolicySchema>

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const AddPolicyModal = ({
  open,
  onOpenChange,
  policyCluster,
  policyIds,
}: AddPolicyModalProps) => {
  const [policy, setPolicy] = React.useState<Policy | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  const [tab, setTab] = React.useState<Tab>(Tab.POLICY)
  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.POLICY]: "not-started",
    [Tab.EDIT]: "not-started",
  })

  const promptTitle = "Are you sure?"
  const promptExitDescription =
    "You have unsaved changes, are you sure you want to exit?"
  const promptBackDescription =
    "You have unsaved changes, are you sure you want to go back?"

  const prompt = usePrompt()

  const form = useForm<AddPolicyFormValue>({
    resolver: zodResolver(addPolicySchema),
    defaultValues: {
      policy: { ids: [] },
    },
  })

  const {
    trigger,
    handleSubmit,
    setValue,
    setError,
    getValues,
    reset,
    formState: { isDirty },
  } = form

  const onCloseModal = React.useCallback(() => {
    onOpenChange(false)
    setTab(Tab.POLICY)
    setSelectedIds([])
    setStatus({
      [Tab.POLICY]: "not-started",
      [Tab.EDIT]: "not-started",
    })

    reset({
      policy: { ids: [] },
    })
  }, [onOpenChange, reset])

  const onModalStateChange = React.useCallback(
    async (open: boolean) => {
      if (!open && isDirty) {
        const response = await prompt({
          title: promptTitle,
          description: promptExitDescription,
        })

        if (!response) {
          onOpenChange(true)
          return
        }

        onCloseModal()
      }

      onOpenChange(open)
    },
    [
      isDirty,
      promptTitle,
      promptExitDescription,
      prompt,
      onCloseModal,
      onOpenChange,
    ]
  )

  const onSetPolicy = React.useCallback(
    (policy: Policy | null) => {
      if (!policy) {
        setPolicy(null)
        setTab(Tab.POLICY)
        return
      }

      //   const defaultValues = getValues(`policy.ids.${policy.id}`)
      //   resetEdit(defaultValues)
      setPolicy(policy)
      setTab(Tab.EDIT)
    },
    [getValues]
  )

  const onTabChange = React.useCallback(
    async (value: Tab) => {
      if (tab === Tab.EDIT) {
        // await onExitProductPrices(value)
        return
      }

      setTab(value)
    },
    [tab]
  )

  const onUpdateSelectedPolicyIds = React.useCallback(
    (ids: string[]) => {
      setSelectedIds((prev) => {
        for (const id of prev) {
          if (!ids.includes(id)) {
            // setValue(`prices.products.${id}`, { variants: {} })
          }
        }

        return ids
      })
    },
    [setValue]
  )

  const onValidateProducts = React.useCallback(async () => {
    const result = await trigger("policy")

    if (!result) {
      setStatus((prev) => ({
        ...prev,
        [Tab.POLICY]: "in-progress",
      }))
      return
    }

    const ids = getValues("policy.ids")

    onUpdateSelectedPolicyIds(ids)

    setTab(Tab.EDIT)
    setStatus((prev) => ({
      ...prev,
      [Tab.POLICY]: "completed",
    }))
  }, [trigger, getValues, onUpdateSelectedPolicyIds])

  const onBack = React.useCallback(async () => {
    switch (tab) {
      case Tab.POLICY:
        onModalStateChange(false)
        break
      case Tab.EDIT:
        // await onCancelPriceEdit()
        break
    }
  }, [tab, onModalStateChange])

  const backButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.POLICY:
        return "Cancel"
      default:
        return "Back"
    }
  }, [tab])

  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.POLICY:
        onValidateProducts()
        break
      case Tab.EDIT:
        // await onSavePriceEdit()
        break
    }
  }, [onValidateProducts, tab])

  const nextButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.POLICY:
        return "Continue"
      case Tab.EDIT:
        return "Save Prices"
    }
  }, [tab])

  return (
    <FocusModal open={open} onOpenChange={onModalStateChange}>
      <ProgressTabs
        value={tab}
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <FocusModal.Content>
          <FocusModal.Header className="flex w-full items-center justify-between">
            <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
              <ProgressTabs.Trigger
                value={Tab.POLICY}
                className="w-full max-w-[200px]"
                status={status[Tab.POLICY]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Choose Policies"}
                </span>
              </ProgressTabs.Trigger>
              {policy && (
                <ProgressTabs.Trigger
                  value={Tab.EDIT}
                  className="w-full max-w-[200px]"
                  status={"not-started"}
                >
                  <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {policy.name}
                  </span>
                </ProgressTabs.Trigger>
              )}
            </ProgressTabs.List>
            <div className="flex flex-1 items-center justify-end gap-x-2">
              <Button
                // disabled={isSubmitting}
                variant="secondary"
                onClick={onBack}
              >
                {backButtonText}
              </Button>
              <Button
                type="button"
                className="whitespace-nowrap"
                // isLoading={isSubmitting}
                onClick={onNext}
              >
                {nextButtonText}
              </Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
            <Form {...form}>
              <ProgressTabs.Content
                value={Tab.POLICY}
                className="h-full w-full"
              >
                <ClusterPolicyForm
                  form={nestedForm(form, "policy")}
                  policies={policyIds}
                />
              </ProgressTabs.Content>
            </Form>
          </FocusModal.Body>
        </FocusModal.Content>
      </ProgressTabs>
    </FocusModal>
  )
}

export { AddPolicyModal }
