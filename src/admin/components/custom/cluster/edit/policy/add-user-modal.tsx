import { PolicyCluster } from "../../../../../../models/policy-cluster"
import { User } from "../../../../../../models/user"
import * as React from "react"
import * as z from "zod"
import {
  clusterUsersSchema,
  ClusterUsersForm,
} from "../../forms/cluster-users-form"
import {
  Button,
  FocusModal,
  ProgressStatus,
  ProgressTabs,
  usePrompt,
} from "@medusajs/ui"
import { useAdminPolicyClusterAttachUsers } from "../../../../hooks/user"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "../../../../shared/form/index"
import { nestedForm } from "../../../../shared/form/nested-form"

type AddUsersModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  policyCluster: PolicyCluster
  userIds: string[]
}

enum Tab {
  USERS = "users",
}

const addUsersSchema = z.object({
  users: clusterUsersSchema,
})

type AddUsersFormValue = z.infer<typeof addUsersSchema>

type StepStatus = {
  [key in Tab]: ProgressStatus
}

const AddUserModal = ({
  open,
  onOpenChange,
  policyCluster,
  userIds,
}: AddUsersModalProps) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])

  const [tab, setTab] = React.useState<Tab>(Tab.USERS)
  const [status, setStatus] = React.useState<StepStatus>({
    [Tab.USERS]: "not-started",
  })

  const promptTitle = "Are you sure?"
  const promptExitDescription =
    "You have unsaved changes, are you sure you want to exit?"
  const promptBackDescription =
    "You have unsaved changes, are you sure you want to go back?"

  const prompt = usePrompt()

  const { mutate, isLoading: isSubmitting } = useAdminPolicyClusterAttachUsers(
    policyCluster.id
  )

  const form = useForm<AddUsersFormValue>({
    resolver: zodResolver(addUsersSchema),
    defaultValues: {
      users: { ids: [] },
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
    setTab(Tab.USERS)
    setSelectedIds([])
    setStatus({
      [Tab.USERS]: "not-started",
    })

    reset({
      users: { ids: [] },
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

  const onSetUser = React.useCallback(
    (user: User | null) => {
      if (!user) {
        setUser(null)
        setTab(Tab.USERS)
        return
      }
      setUser(user)
    },
    [getValues]
  )

  const onTabChange = React.useCallback(
    async (value: Tab) => {
      setTab(value)
    },
    [tab]
  )
  const onUpdateSelectedUserIds = React.useCallback(
    (ids: string[]) => {
      setSelectedIds((prev) => {
        for (const id of prev) {
          if (!ids.includes(id)) {
            // FIXME: What should we do?
          }
        }

        return ids
      })
    },
    [setValue]
  )

  const onValidateUsers = React.useCallback(async () => {
    const result = await trigger("users")

    if (!result) {
      setStatus((prev) => ({
        ...prev,
        [Tab.USERS]: "in-progress",
      }))
      return
    }

    const ids = getValues("users.ids")

    onUpdateSelectedUserIds(ids)

    setStatus((prev) => ({
      ...prev,
      [Tab.USERS]: "completed",
    }))
  }, [trigger, getValues, onUpdateSelectedUserIds])

  const onSubmit = handleSubmit(async (data) => {
    const policyIds = data.users.ids

    mutate(
      { users: policyIds },
      {
        onSuccess: () => {
          // TODO: Notification
          onCloseModal()
        },
        onError: (error) => {
          // TODO: Notification
        },
      }
    )
  })

  const onBack = React.useCallback(async () => {
    switch (tab) {
      case Tab.USERS:
        onModalStateChange(false)
        break
    }
  }, [tab, onModalStateChange])

  const backButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.USERS:
        return "Cancel"
      default:
        return "Back"
    }
  }, [tab])

  const onNext = React.useCallback(async () => {
    switch (tab) {
      case Tab.USERS:
        onValidateUsers()
        await onSubmit()
        break
    }
  }, [onValidateUsers, tab])

  const nextButtonText = React.useMemo(() => {
    switch (tab) {
      case Tab.USERS:
        return "Attach Policy"
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
                value={Tab.USERS}
                className="w-full max-w-[200px]"
                status={status[Tab.USERS]}
              >
                <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {"Choose Users"}
                </span>
              </ProgressTabs.Trigger>
            </ProgressTabs.List>
            <div className="flex flex-1 items-center justify-end gap-x-2">
              <Button
                disabled={isSubmitting}
                variant="secondary"
                onClick={onBack}
              >
                {backButtonText}
              </Button>
              <Button
                type="button"
                className="whitespace-nowrap"
                isLoading={isSubmitting}
                onClick={onNext}
              >
                {nextButtonText}
              </Button>
            </div>
          </FocusModal.Header>
          <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
            <Form {...form}>
              <ProgressTabs.Content value={Tab.USERS} className="h-full w-full">
                <ClusterUsersForm
                  form={nestedForm(form, "users")}
                  userIds={userIds}
                />
              </ProgressTabs.Content>
            </Form>
          </FocusModal.Body>
        </FocusModal.Content>
      </ProgressTabs>
    </FocusModal>
  )
}

export { AddUserModal }
