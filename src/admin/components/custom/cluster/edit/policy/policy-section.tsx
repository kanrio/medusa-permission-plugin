import { useSearchParams } from "react-router-dom"
import { PolicyCluster } from "../../../../../../models/policy-cluster"
import { Policy } from "../../../../../../models/policy"
import * as React from "react"
import {
  Checkbox,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  usePrompt,
  Text,
  Table,
  clx,
  CommandBar,
} from "@medusajs/ui"
import { useDebouncedSearchParam } from "../../../../hooks/use-debounce-search-params"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table"
import {
  EllipsisHorizontal,
  ExclamationCircle,
  Spinner,
  Tag,
  Trash,
} from "@medusajs/icons"
import {
  useAdminPolicyClusterDeletePolicy,
  useAdminPolicyClusterPolicies,
} from "../../../../hooks/cluster"
import { getStringFromSearchParams } from "../../../../../utils/date-comparison-operators"
import { AddPolicyModal } from "./add-policy-modal"

type PolicyClusterPolicySectionProps = {
  policyCluster: PolicyCluster
}

const PAGE_SIZE = 10
const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48

const PolicyClusterPolicySection = ({
  policyCluster,
}: PolicyClusterPolicySectionProps) => {
  const [searchParams] = useSearchParams()

  // TODO: Use later in the add policies modal.
  // const navigate = useNavigate()

  const [showAddPolicyModal, setShowAddPolicyModal] = React.useState(false)

  const [showEditPolicyModal, setShowEditPolicyModal] = React.useState(false)

  const [policyIdsToEdit, setPolicyIdsToEdit] = React.useState<string[] | null>(
    null
  )

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const offset = React.useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination.pageIndex, pagination.pageSize]
  )

  const { query, setQuery } = useDebouncedSearchParam()

  const prompt = usePrompt()

  const { mutate, isLoading: isDeletingPolicyFromCluster } =
    useAdminPolicyClusterDeletePolicy(policyCluster?.id)

  const handleDeletePolicyFromCluster = async () => {
    const res = await prompt({
      title: "Are you sure?",
      description: "This will permanently delete the policy from this cluster",
    })

    if (!res) {
      return
    }

    mutate(
      {
        policy: Object.keys(rowSelection),
      },
      {
        onSuccess: () => {
          // TODO: Notification
          setRowSelection({})
        },
        onError: (err) => {
          // TODO: Notification
        },
      }
    )
  }

  const { data, count, isLoading, isError } = useAdminPolicyClusterPolicies(
    policyCluster.id,
    {
      limit: PAGE_SIZE,
      offset,
      q: getStringFromSearchParams("q", searchParams),
    }
  )

  const {
    data: allPolicy,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useAdminPolicyClusterPolicies(policyCluster.id, {
    limit: 99999, // FIXME: This is a hack to get all policies
    offset,
    q: getStringFromSearchParams("q", searchParams),
  })

  const onEditSinglePolicy = (id: string) => {
    setPolicyIdsToEdit([id])
    setShowEditPolicyModal(true)
  }

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = usePolicyClusterPolicyColumns({
    onEditPolicy: onEditSinglePolicy,
  })

  const table = useReactTable({
    columns,
    data: (data?.policy_cluster as unknown as Policy[] | undefined) ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    meta: {
      policyClusterPolicies: policyCluster.id,
    },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
  })

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-8 pt-6 pb-4">
        <Heading>{"Policy"}</Heading>
        <div className="flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton>
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" side="bottom">
              <DropdownMenu.Item onClick={() => setShowAddPolicyModal(true)}>
                <Tag className="text-ui-fg-subtle" />
                <span className="ml-2">{"Add Policy"}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </div>
      <div
        className="border-ui-border-base relative h-full flex-1 border-b"
        style={{
          height: TABLE_HEIGHT,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="text-ui-fg-subtle animate-spin" />
          </div>
        )}
        {isError && (
          <div className="text-ui-fg-subtle absolute inset-0 flex items-center justify-center gap-x-2">
            <ExclamationCircle />
            <Text size="small">
              {
                "An error occured while fetching the policies. Try to reload the page, or if the issue persists, try again later."
              }
            </Text>
          </div>
        )}
        <Table>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className="[&_th]:w-1/3 [&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.HeaderCell key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Table.HeaderCell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Header>
          <Table.Body className="border-b-0">
            {table.getRowModel().rows.map((row) => (
              <Table.Row
                key={row.id}
                className={clx(
                  "transition-fg [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                  {
                    "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                      row.getIsSelected(),
                  }
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Table.Pagination
        count={count ?? 0}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        pageIndex={pagination.pageIndex}
        pageCount={pageCount}
        pageSize={pagination.pageSize}
      />
      <AddPolicyModal
        policyIds={
          (allPolicy?.policy_cluster?.map((p) => p.id) as string[]) ?? []
        }
        policyCluster={policyCluster}
        open={showAddPolicyModal}
        onOpenChange={setShowAddPolicyModal}
      />
      <CommandBar open={Object.keys(rowSelection).length > 0}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {`${Object.keys(rowSelection).length} selected`}
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            shortcut="d"
            label={"Delete"}
            action={handleDeletePolicyFromCluster}
            disabled={
              isDeletingPolicyFromCluster ||
              showAddPolicyModal ||
              showEditPolicyModal
            }
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

const columnHelper = createColumnHelper<Policy>()

type UsePolicyClusterPolicyColumnProps = {
  onEditPolicy: (id: string) => void
}

const usePolicyClusterPolicyColumns = ({
  onEditPolicy: onEditPolicyCluster,
}: UsePolicyClusterPolicyColumnProps) => {
  const columns = React.useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label={"Select all policies on the current page"}
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={"Select row"}
            />
          )
        },
      }),
      columnHelper.accessor("name", {
        header: () => "Name",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),

      columnHelper.accessor("method", {
        header: () => "Method",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),
      columnHelper.accessor("base_router", {
        header: () => "Base Router",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),

      columnHelper.display({
        id: "actions",
        cell: ({ table, row }) => {
          const { policyClusterPolicies } = table.options.meta as {
            policyClusterPolicies: string | undefined
          }

          return (
            <PolicyClusterPolicyrowActions
              row={row}
              policyClusterId={policyClusterPolicies}
              onEditPolicy={onEditPolicyCluster}
            />
          )
        },
      }),
    ],
    [onEditPolicyCluster]
  )

  return { columns }
}

type PolicyClusterPolicyRowActionsProps = {
  row: Row<Policy>
  policyClusterId?: string
  onEditPolicy: (id: string) => void
}

const PolicyClusterPolicyrowActions = ({
  row,
  policyClusterId,
  onEditPolicy: onEditPolicy,
}: PolicyClusterPolicyRowActionsProps) => {
  const { mutate, isLoading: isDeletingPolicyFromCluster } =
    useAdminPolicyClusterDeletePolicy(policyClusterId)

  const prompt = usePrompt()

  const onDelete = async () => {
    const response = await prompt({
      title: "Are you sure?",
      description:
        "This will permanently delete the this policy from the cluster",
    })

    if (!response) {
      return
    }

    mutate(
      {
        policy: [row.original.id],
      },
      {
        onSuccess: () => {
          // TODO: Notification
        },
        onError: (err) => {
          // TODO: Notification
        },
      }
    )
  }

  // TODO: We should do a edit policy button later.
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" side="bottom">
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onDelete}>
          <Trash className="text-ui-fg-subtle" />
          <span className="ml-2">Delete Policy</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export { PolicyClusterPolicySection }
