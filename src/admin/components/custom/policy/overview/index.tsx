import { Route, Routes } from "react-router-dom"
import { useMemo, useState } from "react"
import BodyCard from "../../../shared/body-card"
import TableViewHeader from "../../../shared/custom-table/table-view-header"
import PlusIcon from "../../../shared/icons/plus-icon"
import PoliciesTable from "../policy-table"
import { SettingProps } from "@medusajs/admin"
import { useNavigate } from "react-router-dom"
import { CreateNewPolicyModal } from "../create-policy-modal/page"

const PolicyIndex = ({ notify }: SettingProps) => {
  const navigate = useNavigate()

  const view = "policy"
  const [open, setOpen] = useState(false)

  const actions = useMemo(() => {
    return [
      {
        label: "Create Policy",
        onClick: () => setOpen(true),
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
          <div className="flex items-center gap-x-2">
            <CreateNewPolicyModal open={open} setOpen={setOpen} />
          </div>
          <PoliciesTable />
        </BodyCard>
      </div>
      <div className="h-xlarge w-full" />
    </div>
  )
}

const Policy = ({ notify }: SettingProps) => {
  return (
    <Routes>
      <Route index element={<PolicyIndex notify={notify} />} />
    </Routes>
  )
}

export default Policy
