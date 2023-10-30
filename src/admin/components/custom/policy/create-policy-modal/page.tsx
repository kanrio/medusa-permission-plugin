import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ProgressStatus,
  usePrompt,
  FocusModal,
  ProgressTabs,
  Button,
} from "@medusajs/ui"
import { policyDetailsSchema } from "../forms/policy-details-form"
import * as React from "react"
import { useForm } from "react-hook-form"
import { mutateAdminPolicy } from "../../../hooks/policy"
import { Form } from "../../../shared/form"
import { nestedForm } from "../../../shared/form/nested-form"
import { PolicyDetailsForm } from "../forms/policy-details-form"
import {
  PolicySettingsForm,
  policySettingsSchema,
} from "../forms/policy-settings-form"

enum Tab {
  DETAILS = "details",
  SETTINGS = "settings",
}

const policyNewSchema = z.object({
  details: policyDetailsSchema,
  settings: policySettingsSchema,
})

type PolicyNewSchema = z.infer<typeof policyNewSchema>

type StepStatus = {
  [key in Tab]: ProgressStatus
}

export const CreateNewPolicyModal = ({ open, setOpen }) => {
  const [tab, setTab] = React.useState<Tab>(Tab.DETAILS)
  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.DETAILS]: "not-started",
    [Tab.SETTINGS]: "not-started",
  })

  const promptTitle = "Are you sure?"
  const promptExitDescription =
    "You have unsaved changes, are you sure you want to exit?"

  const prompt = usePrompt()

  const form = useForm<PolicyNewSchema>({
    resolver: zodResolver(policyNewSchema),
    defaultValues: {
      details: {
        general: {
          name: "",
          description: "",
        },
      },
      settings: {
        settings: {
          base_router: "",
          method: "GET",
        },
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

  const { mutate, isLoading, isError } = mutateAdminPolicy()

  const onCloseModal = React.useCallback(() => {
    setOpen(false)
    setTab(Tab.DETAILS)
    setStatus({
      [Tab.DETAILS]: "not-started",
      [Tab.SETTINGS]: "not-started",
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
          name: data.details.general.name.trim(),
          description: data.details.general.description,
          method: data.settings.settings.method.trim(),
          base_router: data.settings.settings.base_router,
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

    setTab(Tab.SETTINGS)
    setStatus((prev) => ({
      ...prev,
      [Tab.DETAILS]: "completed",
    }))
  }, [trigger])

  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.DETAILS:
        await onValidateDetails()
        break
      case Tab.SETTINGS:
        await onSubmit()
        break
    }
  }, [onSubmit, tab])

  const nextButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.SETTINGS:
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
      case Tab.SETTINGS:
        setTab(Tab.DETAILS)
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
                  {"Policy Details"}
                </span>
              </ProgressTabs.Trigger>
              <ProgressTabs.Trigger
                value={Tab.SETTINGS}
                disabled={status[Tab.DETAILS] !== "completed"}
                className="w-full min-w-0  max-w-[200px]"
                status={status[Tab.SETTINGS]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Policy Settings"}
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
                    <PolicyDetailsForm
                      form={nestedForm(form, "details")}
                      layout="focus"
                    />
                  </div>
                </ProgressTabs.Content>
                <ProgressTabs.Content
                  value={Tab.SETTINGS}
                  className="h-full w-full max-w-[720px]"
                >
                  <div className="px-8 py-12">
                    <PolicySettingsForm
                      form={nestedForm(form, "settings")}
                      layout="focus"
                    />
                  </div>
                </ProgressTabs.Content>
              </Form>
            </FocusModal.Body>
          )}
        </FocusModal.Content>
      </ProgressTabs>
    </FocusModal>
  )
}
