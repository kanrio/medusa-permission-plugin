import { ExclamationCircle, Spinner } from "@medusajs/icons"
import {
  Checkbox,
  Heading,
  Input,
  StatusBadge,
  Table,
  Text,
  clx,
} from "@medusajs/ui"
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
import { ClusterPolicySchema } from "./types"
import { NestedForm } from "../../../../shared/form/nested-form"
import {
  PolicyFilter,
  PolicyFilterMenu,
} from "../../../policy/policy-filter-menu"
import { Form } from "../../../../shared/form"
import { useDebounce } from "../../../../hooks/use-debounce"
import { Policy, useAdminPolicy } from "../../../../hooks/policy"

interface ClusterPolicyFormProp {
  form: NestedForm<ClusterPolicySchema>
  policies?: string[]
}

const PAGE_SIZE = 20

const columnHelper = createColumnHelper<Policy>()
const useClusterPolicyFormColumns = () => {
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
        cell: ({ table, row }) => {
          const { policies } = table.options.meta as {
            policies: string[]
          }

          const isSelected = row.getIsSelected() || policies.includes(row.id)

          return (
            <Checkbox
              checked={isSelected}
              disabled={policies.includes(row.id)}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label={"Select row"}
            />
          )
        },
      }),
      columnHelper.accessor("name", {
        header: () => "Name",
        cell: (info) => {
          const title = info.getValue()

          return (
            <div className="flex items-center gap-x-3">
              <Text size="small" className="text-ui-fg-base">
                {title}
              </Text>
            </div>
          )
        },
      }),
      columnHelper.accessor("base_router", {
        header: () => "Router",
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("method", {
        header: () => "Method",
        cell: (info) => {
          const status = info.getValue()
          let color

          switch (status) {
            case "GET": {
              color = "green"
              break
            }
            case "POST": {
              color = "purple"
              break
            }
            case "DELETE": {
              color = "red"
              break
            }
            case "PUT": {
              color = "blue"
              break
            }
            case "PATCH": {
              color = "orange"
              break
            }
          }

          return (
            <StatusBadge color={color} className="capitalize">
              {status}
            </StatusBadge>
          )
        },
      }),
    ],
    []
  )

  return { columns }
}
const ClusterPolicyForm = ({ form, policies }: ClusterPolicyFormProp) => {
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

  const { data, count, isLoading } = useAdminPolicy({
    limit: PAGE_SIZE,
    offset,
    q: debouncedQuery,
    ...filters,
  })

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = useClusterPolicyFormColumns()

  const table = useReactTable({
    columns,
    data: (data?.policy as Policy[] | undefined) ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    meta: {
      policies: policies ?? [],
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
        <span className="sr-only">{"Loading policies"}</span>
      </div>
    )
  }

  if (!data?.policy) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2">
        <ExclamationCircle />
        <Text className="text-ui-fg-subtle">{"No policies found."}</Text>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-ui-border-base flex items-center justify-between border-b px-8 pt-6 pb-4">
        <div className="flex items-center gap-x-3">
          <Heading>{"Choose policies"}</Heading>
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
                      policies?.includes(row.id),
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
    </div>
  )
}

export { ClusterPolicyForm }
