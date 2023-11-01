import { useParams } from "react-router-dom"
import { PolicyClusterEdit } from "../../../components/custom/cluster/edit/index"

const PolicyClusterDetailsPage = () => {
  const { id } = useParams()

  return <PolicyClusterEdit />
}

export default PolicyClusterDetailsPage
