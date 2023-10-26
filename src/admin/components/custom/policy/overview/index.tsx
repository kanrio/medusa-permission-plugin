import { Route, Routes } from "react-router-dom"
import { useMemo } from "react"
import BodyCard from "../../../shared/body-card"
import TableViewHeader from "../../../shared/custom-table/table-view-header"
import PlusIcon from "../../../shared/icons/plus-icon"
import PoliciesTable from "../policy-table"
import {
  CreatePolicyModalProvider,
  CreatePolicyModal,
  useCreatePolicyModal,
} from "../create-new-policy-modal"
import { SettingProps } from "@medusajs/admin"
import { useNavigate } from "react-router-dom"

const PolicyIndex = ({ notify }: SettingProps) => {
  const navigate = useNavigate()

  const view = "policy"
  const { showNewPolicy, setShowNewPolicy } = useCreatePolicyModal()

  const actions = useMemo(() => {
    return [
      {
        label: "Create Policy",
        onClick: () => setShowNewPolicy(true),
        icon: <PlusIcon size={20} />,
      },
    ]
  }, [view])

  return (
    <div className="gap-y-xsmall flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={
            <TableViewHeader
              views={["policy", "cluster"]}
              setActiveView={(v) => {
                if (v === "cluster") {
                  navigate(`/a/cluster`)
                }
              }}
              activeView={view}
            />
          }
          actionables={actions}
          className="h-fit"
        >
          <PoliciesTable />
        </BodyCard>
      </div>
      <div className="h-xlarge w-full" />
      <CreatePolicyModal notify={notify} />
    </div>
  )
}

const Policy = ({ notify }: SettingProps) => {
  return (
    <CreatePolicyModalProvider>
      <Routes>
        <Route index element={<PolicyIndex notify={notify} />} />
      </Routes>
    </CreatePolicyModalProvider>
  )
}

export default Policy
