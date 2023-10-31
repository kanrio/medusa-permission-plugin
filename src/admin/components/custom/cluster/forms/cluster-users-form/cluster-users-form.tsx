import { ExclamationCircle, Spinner } from "@medusajs/icons"
import { Checkbox, Heading, Table, Text, clx, Input } from "@medusajs/ui"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table"
import * as React from "react"

import { ClusterUsersSchema } from "./types"
import { NestedForm } from "../../../../shared/form/nested-form"
import { Form } from "../../../../shared/form"
import { useDebounce } from "../../../../hooks/use-debounce"
import { useAdminUserList, User } from "../../../../hooks/user-list"
import {
  PolicyFilter,
  PolicyFilterMenu,
} from "../../../policy/policy-filter-menu"

interface ClusterPolicyUsersFormProp {
  form: NestedForm<ClusterUsersSchema>
  userIds?: string[]
}

const PAGE_SIZE = 20

const columnHelper = createColumnHelper<User>()
const useClusterUsersFormColumn = () => {
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
              aria-label={"Select all users on the current page"}
            />
          )
        },
        cell: ({ table, row }) => {
          const { userIds } = table.options.meta as {
            userIds: string[]
          }

          const isSelected = row.getIsSelected() || userIds.includes(row.id)

          return (
            <Checkbox
              checked={isSelected}
              disabled={userIds.includes(row.id)}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label={"Select row"}
            />
          )
        },
      }),
      columnHelper.accessor("email", {
        header: () => "Email",
        cell: (info) => {
          const email = info.getValue()

          return (
            <div className="flex items-center gap-x-3">
              <Text size="small" className="text-ui-fg-base">
                {email}
              </Text>
            </div>
          )
        },
      }),
      columnHelper.accessor("first_name", {
        header: () => "First Name",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("last_name", {
        header: () => "Last Name",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("role", {
        header: () => "Role",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("policy_cluster.name", {
        header: () => "Policy Cluster",
        cell: (info) => info.getValue() ?? "-",
      }),
    ],
    []
  )

  return { columns }
}
const ClusterUsersForm = ({ form, userIds }: ClusterPolicyUsersFormProp) => {
  const {
    register,
    path,
    setValue,
    getValues,
    control,
    formState: { isDirty },
  } = form

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    (getValues(path("ids")) ?? []).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: true,
      }
    }, {} as RowSelectionState)
  )

  React.useEffect(() => {
    const values = getValues(path("ids")) ?? []

    setRowSelection(
      values.reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: true,
        }
      }, {} as RowSelectionState)
    )
  }, [getValues, path])

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const offset = React.useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination.pageIndex, pagination.pageSize]
  )

  const [filters, setFilters] = React.useState<PolicyFilter>({
    created_at: undefined,
    updated_at: undefined,
  })

  const [query, setQuery] = React.useState<string>("")
  const debouncedQuery = useDebounce(query, 500)

  const { data, count, isLoading } = useAdminUserList({
    limit: PAGE_SIZE,
    offset,
    q: debouncedQuery,
    ...filters,
  })

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = useClusterUsersFormColumn()

  const table = useReactTable({
    columns,
    data: (data?.user as User[] | undefined) ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    meta: {
      userIds: userIds ?? [],
    },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
  })

  React.useEffect(() => {
    register(path("ids"))
  }, [register, path])

  React.useEffect(() => {
    setValue(path("ids"), Object.keys(rowSelection), {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, path, setValue])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="animate-spin" />
        <span className="sr-only">{"Loading users"}</span>
      </div>
    )
  }

  if (!data.user) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2">
        <ExclamationCircle />
        <Text className="text-ui-fg-subtle">{"No users found."}</Text>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-ui-border-base flex items-center justify-between border-b px-8 pt-6 pb-4">
        <div className="flex items-center gap-x-3">
          <Heading>{"Choose users"}</Heading>
          {isDirty && (
            <Form.Field
              control={control}
              name={path("ids")}
              render={() => {
                return (
                  <Form.Item>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          )}
        </div>
        <div className={clx("flex items-center gap-x-2")}>
          <PolicyFilterMenu
            onClearFilters={() =>
              setFilters({
                created_at: undefined,
                updated_at: undefined,
              })
            }
            onFilterChange={setFilters}
            value={filters}
          />
          <Input
            type="search"
            placeholder={"Search" ?? undefined}
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="border-ui-border-base relative h-full flex-1 overflow-y-auto border-b">
        <Table>
          <Table.Header className="border-t-0">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
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
                  {
                    "bg-ui-bg-disabled hover:bg-ui-bg-disabled":
                      userIds?.includes(row.id),
                  },
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
    </div>
  )
}

export { ClusterUsersForm }
