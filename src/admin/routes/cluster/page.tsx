import { useMemo, useState } from "react"
import ClusterTable from "../../components/custom/cluster/cluster-table"
import BodyCard from "../../components/shared/body-card"
import PlusIcon from "../../components/shared/icons/plus-icon"
import { useNavigate } from "react-router-dom"
import TableViewHeader from "../../components/shared/custom-table/table-view-header"
import BackButton from "../../components/shared/back-button"
import { CreateNewClusterModal } from "../../components/custom/cluster/create-new-cluster-modal/page"

export const ClusterPage = () => {
  const navigate = useNavigate()
  const view = "cluster"
  const [open, setOpen] = useState(false)

  const actions = useMemo(() => {
    return [
      {
        label: "Create Cluster",
        onClick: () => {
          setOpen(true)
        },
        icon: <PlusIcon size={20} />,
      },
    ]
  }, [])

  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="gap-y-xsmall flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            customHeader={
              <TableViewHeader
                views={["policy", "cluster"]}
                setActiveView={(v) => {
                  if (v === "policy") {
                    navigate(`/a/settings/permissions`)
                  }
                }}
                activeView={view}
              />
            }
            actionables={actions}
            className="h-fit"
          >
            <div className="flex items-center gap-x-2">
              <CreateNewClusterModal open={open} setOpen={setOpen} />
            </div>
            <ClusterTable />
          </BodyCard>
        </div>
        <div className="h-xlarge w-full" />
      </div>
    </div>
  )
}

// @ts-ignore
export default ClusterPage
