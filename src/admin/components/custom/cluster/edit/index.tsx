import { ExclamationCircle, Spinner } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useAdminPolicyCluster } from "../../../hooks/cluster"
import { PolicyClusterDetailsSection } from "./details/details-section"
import { PolicyClusterPolicySection } from "./policy/policy-section"
import { PolicyClusterUserSection } from "./policy/user-section"

const PolicyClusterEdit = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useAdminPolicyCluster(id)

  if (isLoading) {
    return (
      <Container className="flex min-h-[320px] items-center justify-center">
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </Container>
    )
  }

  if (isError || !data?.policy_cluster) {
    return (
      <Container className="flex min-h-[320px] items-center justify-center">
        <div className="flex items-center gap-x-2">
          <ExclamationCircle className="text-ui-fg-base" />
          <Text className="text-ui-fg-subtle">
            {
              "An error occurred while loading policy cluster. Reload the page and try again. If the issue persists, try again later."
            }
          </Text>
        </div>
      </Container>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-y-2">
        <PolicyClusterDetailsSection
          key={`${data?.policy_cluster.updated_at}`}
          // @ts-ignore
          policyCluster={data?.policy_cluster}
        />
        {/* Spacer */}
        <div className="h-xlarge w-full" />
        <PolicyClusterPolicySection
          key={`${data?.policy_cluster.updated_at}`}
          // @ts-ignore
          policyCluster={data?.policy_cluster}
        ></PolicyClusterPolicySection>
        {/* Spacer */}
        <div className="h-xlarge w-full" />
        <PolicyClusterUserSection
          key={`${data?.policy_cluster.updated_at}`}
          // @ts-ignore
          policyCluster={data?.policy_cluster}
        />
      </div>
    </>
  )
}

export { PolicyClusterEdit }
