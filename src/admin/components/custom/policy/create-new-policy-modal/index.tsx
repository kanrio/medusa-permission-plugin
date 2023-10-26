import React, { createContext, useContext, useState } from "react"
import {
  FocusModal,
  Input,
  Heading,
  Text,
  Button,
  Label,
  RadioGroup,
  Badge,
} from "@medusajs/ui"
import { mutateAdminPolicy } from "../../../hooks/policy"
import { SettingProps } from "@medusajs/admin"

type createPolicyModalContextType = {
  showNewPolicy: boolean
  setShowNewPolicy: React.Dispatch<React.SetStateAction<boolean>>
}

type ErrorsType = {
  policyName?: string
  description?: string
  baseRouter?: string
}

const CreatePolicyModalContext = createContext<
  createPolicyModalContextType | undefined
>(undefined)

export const CreatePolicyModalProvider = ({ children }) => {
  const [showNewPolicy, setShowNewPolicy] = useState(false)

  return (
    <CreatePolicyModalContext.Provider
      value={{ showNewPolicy, setShowNewPolicy }}
    >
      {children}
    </CreatePolicyModalContext.Provider>
  )
}

export const useCreatePolicyModal = () => {
  return useContext(CreatePolicyModalContext)
}

export function CreatePolicyModal({ notify }: SettingProps) {
  const { showNewPolicy, setShowNewPolicy } = useCreatePolicyModal()

  const [policyName, setPolicyName] = useState("")
  const [description, setDescription] = useState("")
  const [method, setMethod] = useState("GET")
  const [baseRouter, setBaseRouter] = useState("")

  const [errors, setErrors] = useState<ErrorsType>({})

  const { mutate, isLoading } = mutateAdminPolicy()

  const validate = () => {
    const validationErrors = { ...errors }
    if (!policyName.trim()) {
      validationErrors.policyName = "Policy name is required"
    } else {
      delete validationErrors.policyName
    }

    if (!baseRouter.trim()) {
      validationErrors.baseRouter = "Base router is required."
    } else if (!/^[a-zA-Z0-9]+$/.test(baseRouter)) {
      validationErrors.baseRouter =
        "Base router should only contain letters and numbers."
    } else {
      delete validationErrors.baseRouter
    }

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  const clearAllStates = () => {
    setPolicyName("")
    setDescription("")
    setMethod("GET")
    setBaseRouter("")
    setErrors({})
  }

  const handleSave = async () => {
    if (!validate()) {
      return
    }

    const args = {
      name: policyName,
      description: description,
      method: method,
      base_router: baseRouter,
    }

    return mutate(args, {
      onSuccess: () => {
        clearAllStates()
        setShowNewPolicy(false)
        notify.success("success", "Successfully created policy")
      },

      onError: (data) => {
        if (data.message.includes("422")) {
          notify.error("error", "This policy name already exists.")
        } else {
          notify.error("error", "Something happened")
        }
      },
    })
  }

  return (
    <FocusModal
      open={showNewPolicy}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          clearAllStates()
        }
        setShowNewPolicy(isOpen)
      }}
    >
      <FocusModal.Content>
        <FocusModal.Header>
          <Button variant="primary" isLoading={isLoading} onClick={handleSave}>
            Save
          </Button>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-lg flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Heading>Create New Policy</Heading>
              <Text className="text-ui-fg-subtle">
                Create policy for your permissions. You can create multiple
                policies to organize your permissions.
              </Text>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="policy_name" className="text-ui-fg-subtle">
                Policy name
              </Label>
              <Input
                id="policy_name"
                placeholder="Create Product Policy"
                onChange={(e) => setPolicyName(e.target.value)}
                style={errors.policyName ? { borderColor: "red" } : {}}
              />
              {errors.policyName && (
                <div style={{ color: "red" }}>{errors.policyName}</div>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="description" className="text-ui-fg-subtle">
                Description(optional)
              </Label>
              <Input
                id="description"
                placeholder="Manages creating product workflow, if is this attached policy cluster can create products"
                onChange={(e) => setDescription(e.target.value)}
                style={errors.description ? { borderColor: "red" } : {}}
              />
              {errors.description && (
                <div style={{ color: "red" }}>{errors.description}</div>
              )}
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="method" className="text-ui-fg-subtle">
                Method
              </Label>

              <RadioGroup value={method} onChange={() => {}}>
                <div className="flex items-center gap-x-3">
                  <RadioGroup.Item
                    value="GET"
                    id="radio_1"
                    onClick={() => setMethod("GET")}
                  />

                  <Badge color="green" rounded="full">
                    GET
                  </Badge>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioGroup.Item
                    value="POST"
                    id="radio_2"
                    onClick={() => setMethod("POST")}
                  />
                  <Badge color="purple" rounded="full">
                    POST
                  </Badge>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioGroup.Item
                    value="DELETE"
                    id="radio_3"
                    onClick={() => setMethod("DELETE")}
                  />
                  <Badge color="red" rounded="full">
                    DELETE
                  </Badge>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioGroup.Item
                    value="PUT"
                    id="radio_4"
                    onClick={() => setMethod("PUT")}
                  />
                  <Badge color="blue" rounded="full">
                    PUT
                  </Badge>
                </div>
                <div className="flex items-center gap-x-3">
                  <RadioGroup.Item
                    value="PATCH"
                    id="radio_5"
                    onClick={() => setMethod("PATCH")}
                  />
                  <Badge color="orange" rounded="full">
                    PATCH
                  </Badge>
                </div>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="base_router" className="text-ui-fg-subtle">
                Base Router
              </Label>
              <Text className="text-ui-fg-subtle">
                Select base router for your policy. The permission middleware
                will listen this router.
              </Text>
              <Input
                id="base_router"
                placeholder="products"
                onChange={(e) => setBaseRouter(e.target.value)}
                style={errors.baseRouter ? { borderColor: "red" } : {}}
              />
              {errors.baseRouter && (
                <div style={{ color: "red" }}>{errors.baseRouter}</div>
              )}
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}
