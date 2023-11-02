import { PolicyClusterEdit } from "../../../components/custom/cluster/edit/index"
import BackButton from "../../../components/shared/back-button"

const PolicyClusterDetailsPage = () => {
  return (
    <>
      <BackButton
        label="Back to clusters"
        path="/a/cluster"
        className="mb-xsmall"
      />

      <PolicyClusterEdit />
    </>
  )
}

export default PolicyClusterDetailsPage
