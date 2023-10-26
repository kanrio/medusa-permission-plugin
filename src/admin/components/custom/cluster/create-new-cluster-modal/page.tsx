import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  FocusModal,
  ProgressTabs,
  Text,
  usePrompt,
  type ProgressStatus,
} from "@medusajs/ui"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  ClusterPolicyForm,
  clusterPolicySchema,
} from "../forms/cluster-policy-form"
import { Form } from "../../../shared/form"
import { nestedForm } from "../../../shared/form/nested-form"
import { mutateClusterPolicy } from "../../../hooks/cluster"
import {
  clusterDetailsSchema,
  ClusterDetailsForm,
} from "../forms/cluster-details-form"
import {
  ClusterUsersForm,
  clusterUsersSchema,
} from "../forms/cluster-users-form"
import { ExclamationCircle, Spinner } from "@medusajs/icons"

enum Tab {
  DETAILS = "details",
  POLICIES = "products",
  USERS = "prices",
}

const clusterNewSchema = z.object({
  details: clusterDetailsSchema,
  products: clusterPolicySchema,
  users: clusterUsersSchema,
})

type ClusterNewSchema = z.infer<typeof clusterNewSchema>

type StepStatus = {
  [key in Tab]: ProgressStatus
}

export const CreateNewClusterModal = ({ open, setOpen }) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)
  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.DETAILS]: "not-started",
    [Tab.POLICIES]: "not-started",
    [Tab.USERS]: "not-started",
  })

  const promptTitle = "Are you sure?"
  const promptExitDescription =
    "You have unsaved changes, are you sure you want to exit?"

  const prompt = usePrompt()

  const form = useForm<ClusterNewSchema>({
    resolver: zodResolver(clusterNewSchema),
    defaultValues: {
      details: {
        general: {
          name: "",
          description: "",
        },
      },
      products: {
        ids: [],
      },
      users: {
        ids: [],
      },
    },
  })

  const {
    trigger,
    reset,
    getValues,
    setError,
    handleSubmit,
    formState: { isDirty },
  } = form

  const { mutate, isLoading, isError } = mutateClusterPolicy()

  const onCloseModal = React.useCallback(() => {
    setOpen(false)
    setTab(Tab.DETAILS)
    setSelectedIds([])
    setStatus({
      [Tab.DETAILS]: "not-started",
      [Tab.POLICIES]: "not-started",
      [Tab.USERS]: "not-started",
    })
    reset()
  }, [reset])

  const onModalStateChange = React.useCallback(
    async (open: boolean) => {
      if (!open && isDirty) {
        const response = await prompt({
          title: promptTitle,
          description: promptExitDescription,
        })

        if (!response) {
          setOpen(true)
          return
        }

        onCloseModal()
      }

      setOpen(open)
    },
    [isDirty, promptTitle, promptExitDescription, prompt, onCloseModal]
  )

  const onSubmit = React.useCallback(async () => {
    await handleSubmit(async (data) => {
      const productIds = data.products.ids
      const payloadPolicies = []
      productIds.forEach((payloadId) => {
        payloadPolicies.push({ id: payloadId })
      })

      const userIds = data.users.ids

      const payloadUsers = []
      userIds.forEach((payloadId) => {
        payloadUsers.push(payloadId)
      })

      const res = await prompt({
        title: "Are you sure?",
        description:
          "You are going to create a cluster and this action will give selected users the selected permissions.",
      })

      if (!res) {
        return
      }

      mutate(
        {
          name: data.details.general.name,
          description: data.details.general.description,
          policy: payloadPolicies,
          user: payloadUsers,
        },
        {
          onSuccess: () => {
            onCloseModal()
          },
          onError: () => {},
        }
      )
    })()
  }, [handleSubmit, mutate, onCloseModal, prompt])

  const onTabChange = React.useCallback(async (value: Tab) => {
    setTab(value)
  }, [])

  const onValidateDetails = React.useCallback(async () => {
    const result = await trigger("details")

    if (!result) {
      setStatus((prev) => ({
        ...prev,
        [Tab.DETAILS]: "in-progress",
      }))

      return
    }

    setTab(Tab.POLICIES)
    setStatus((prev) => ({
      ...prev,
      [Tab.DETAILS]: "completed",
    }))
  }, [trigger])

  const onValidateProducts = React.useCallback(async () => {
    const result = await trigger("products")

    if (!result) {
      setStatus((prev) => ({
        ...prev,
        [Tab.POLICIES]: "in-progress",
      }))

      return
    }
    getValues("products.ids")
    setTab(Tab.USERS)
    setStatus((prev) => ({
      ...prev,
      [Tab.POLICIES]: "completed",
    }))
  }, [trigger, getValues])

  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.DETAILS:
        await onValidateDetails()
        break
      case Tab.POLICIES:
        await onValidateProducts()
        break
      case Tab.USERS:
        await onSubmit()
        break
    }
  }, [onValidateDetails, onValidateProducts, onSubmit, tab])

  const nextButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.USERS:
        return "Save"
      default:
        return "Continue"
    }
  }, [tab])

  const onBack = React.useCallback(async () => {
    switch (tab) {
      case Tab.DETAILS:
        await onModalStateChange(false)
        break
      case Tab.POLICIES:
        setTab(Tab.DETAILS)
        break
      case Tab.USERS:
        setTab(Tab.POLICIES)
        break
    }
  }, [onModalStateChange, tab])

  const backButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.DETAILS:
        return "Cancel"
      default:
        return "Back"
    }
  }, [tab])

  return (
    <FocusModal open={open} onOpenChange={onModalStateChange}>
      <ProgressTabs
        value={tab}
        onValueChange={(tab) => onTabChange(tab as Tab)}
      >
        <FocusModal.Content>
          <FocusModal.Header className="flex w-full items-center justify-start">
            <ProgressTabs.List className="border-ui-border-base -my-2 ml-2 min-w-0 flex-1 border-l">
              <ProgressTabs.Trigger
                value={Tab.DETAILS}
                className="w-full min-w-0 max-w-[200px]"
                status={status[Tab.DETAILS]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Create Cluster"}
                </span>
              </ProgressTabs.Trigger>
              <ProgressTabs.Trigger
                value={Tab.POLICIES}
                disabled={status[Tab.DETAILS] !== "completed"}
                className="w-full min-w-0  max-w-[200px]"
                status={status[Tab.POLICIES]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Attach Policy"}
                </span>
              </ProgressTabs.Trigger>
              <ProgressTabs.Trigger
                value={Tab.USERS}
                disabled={
                  status[Tab.DETAILS] !== "completed" &&
                  status[Tab.POLICIES] !== "completed"
                }
                className="w-full min-w-0 max-w-[200px]"
                status={status[Tab.USERS]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Attach User"}
                </span>
              </ProgressTabs.Trigger>
            </ProgressTabs.List>
            <div className="ml-auto flex items-center justify-end gap-x-2">
              <Button variant="secondary" onClick={onBack} disabled={isLoading}>
                {backButtonText}
              </Button>
              <Button type="button" onClick={onNext} isLoading={isLoading}>
                {nextButtonText}
              </Button>
            </div>
          </FocusModal.Header>
          {open && (
            <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
              <Form {...form}>
                <ProgressTabs.Content
                  value={Tab.DETAILS}
                  className="h-full w-full max-w-[720px]"
                >
                  <div className="px-8 py-12">
                    <ClusterDetailsForm
                      form={nestedForm(form, "details")}
                      layout="focus"
                      enableTaxToggle={false}
                    />
                  </div>
                </ProgressTabs.Content>
                <ProgressTabs.Content
                  value={Tab.POLICIES}
                  className="h-full w-full"
                >
                  <ClusterPolicyForm form={nestedForm(form, "products")} />
                </ProgressTabs.Content>
                {isLoading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Spinner className="text-ui-fg-subtle animate-spin" />
                  </div>
                ) : isError ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="text-ui-fg-subtle flex items-center gap-x-2">
                      <ExclamationCircle />
                      <Text>
                        {
                          "An error occurred while preparing the form. Reload the page and try again. If the issue persists, try again later."
                        }
                      </Text>
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <ProgressTabs.Content
                      value={Tab.USERS}
                      className="h-full w-full"
                    >
                      <ClusterUsersForm form={nestedForm(form, "users")} />
                    </ProgressTabs.Content>
                  </React.Fragment>
                )}
              </Form>
            </FocusModal.Body>
          )}
        </FocusModal.Content>
      </ProgressTabs>
    </FocusModal>
  )
}
