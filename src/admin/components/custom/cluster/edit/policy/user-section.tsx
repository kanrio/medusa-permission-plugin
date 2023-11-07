import * as React from "react"
import { PolicyCluster } from "../../../../../../models/policy-cluster"

import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type Row,
} from "@tanstack/react-table"

import { useDebouncedSearchParam } from "../../../../hooks/use-debounce-search-params"
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
} from "@medusajs/ui"
import {
  useAdminPolicyClusterUsers,
  useAdminPolicyClusterUsersDeleteBatch,
} from "../../../../hooks/user"
import { User } from "../../../../../../models/user"
import {
  EllipsisHorizontal,
  ExclamationCircle,
  Spinner,
  Tag,
  Trash,
} from "@medusajs/icons"

type PolicyClusterUserSectionProps = {
  policyCluster: PolicyCluster
}

const PAGE_SIZE = 10
const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48

const PolicyClusterUserSection = ({
  policyCluster,
}: PolicyClusterUserSectionProps) => {
  const [showAddUserModal, setShowAddUserModal] = React.useState(false)

  const [showEditUserModal, setShowEditUserModal] = React.useState(false)

  const [userIdsToEdit, setUserIdsToEdit] = React.useState<string[] | null>(
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

  const { mutate, isLoading: isDeletingUserFromCluster } =
    useAdminPolicyClusterUsersDeleteBatch(policyCluster?.id)

  const handleDeleteUserFromCluster = async () => {
    const res = await prompt({
      title: "Are you sure?",
      description: "This will permanently delete the user from this cluster",
    })

    if (!res) {
      return
    }

    mutate(
      {
        users: Object.keys(rowSelection),
      },
      {
        onSuccess: () => {
          setRowSelection({})
        },
        onError: (err) => {
          // TODO: Notification
        },
      }
    )
  }

  const { data, count, isLoading, isError } = useAdminPolicyClusterUsers(
    policyCluster.id,
    {
      limit: PAGE_SIZE,
      offset,
    }
  )

  const onEditSingleUser = (id: string) => {
    setUserIdsToEdit([id])
    setShowEditUserModal(true)
  }

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = usePolicyClusterUserColumns({
    onEditUser: onEditSingleUser,
  })

  const table = useReactTable({
    columns,
    data: (data?.users as unknown as User[] | undefined) ?? [],
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
        <Heading>{"User"}</Heading>
        <div className="flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton>
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" side="bottom">
              <DropdownMenu.Item onClick={() => setShowAddUserModal(true)}>
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
    </Container>
  )
}

const columnHelper = createColumnHelper<User>()

type UsePolicyClusterPolicyColumnProps = {
  onEditUser: (id: string) => void
}

const usePolicyClusterUserColumns = ({
  onEditUser: onEditPolicyCluster,
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
      columnHelper.accessor("first_name", {
        header: () => "First Name",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),

      columnHelper.accessor("last_name", {
        header: () => "Last Name",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),
      columnHelper.accessor("email", {
        header: () => "Email",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),

      columnHelper.accessor("role", {
        header: () => "Role",
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
            <PolicyClusterUserRowActions
              row={row}
              policyClusterId={policyClusterPolicies}
              onEditUser={onEditPolicyCluster}
            />
          )
        },
      }),
    ],
    [onEditPolicyCluster]
  )

  return { columns }
}

type PolicyClusterUserRowActionsProps = {
  row: Row<User>
  policyClusterId?: string
  onEditUser: (id: string) => void
}

const PolicyClusterUserRowActions = ({
  row,
  policyClusterId,
  onEditUser: onEditUser,
}: PolicyClusterUserRowActionsProps) => {
  const { mutate, isLoading: isDeletingUserFromCluster } =
    useAdminPolicyClusterUsersDeleteBatch(policyClusterId)

  const prompt = usePrompt()

  const onDelete = async () => {
    const response = await prompt({
      title: "Are you sure?",
      description:
        "This will permanently delete the this user from the cluster",
    })

    if (!response) {
      return
    }

    mutate(
      {
        users: [row.original.id],
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
          <span className="ml-2">Delete User From Cluster</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export { PolicyClusterUserSection }
