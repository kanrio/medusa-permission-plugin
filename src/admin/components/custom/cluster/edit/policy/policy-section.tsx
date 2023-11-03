import { useNavigate, useSearchParams } from "react-router-dom"
import { PolicyCluster } from "../../../../../../models/policy-cluster"
import { Policy } from "../../../../../../models/policy"
import * as React from "react"
import {
  Checkbox,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
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
  PolicyFilter,
  PolicyFilterMenu,
} from "../../../policy/policy-filter-menu"
import {
  CurrencyDollar,
  EllipsisHorizontal,
  ExclamationCircle,
  PencilSquare,
  Spinner,
  Tag,
  Trash,
} from "@medusajs/icons"
import {
  useAdminPolicyClusterDeletePolicy,
  useAdminPolicyClusterPolicies,
} from "../../../../hooks/cluster"
import { getDateComparisonOperatorFromSearchParams } from "./getDateComparisonOperatorFromSearchParams"
import {} from "medusa-react"

type PolicyClusterPolicySectionProps = {
  policyCluster: PolicyCluster
}

const PAGE_SIZE = 10
const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48

const PolicyClusterPolicySection = ({
  policyCluster,
}: PolicyClusterPolicySectionProps) => {
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  const [showAddProductsModal, setShowAddProductsModal] = React.useState(false)
  const [showEditPricesModal, setShowEditPricesModal] = React.useState(false)

  const [productIdsToEdit, setProductIdsToEdit] = React.useState<
    string[] | null
  >(null)

  /**
   * Table state.
   */
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  /**
   * Calculate the offset based on the pagination state.
   */
  const offset = React.useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination.pageIndex, pagination.pageSize]
  )

  const { query, setQuery } = useDebouncedSearchParam()

  const onFiltersChange = (filters: PolicyFilter) => {
    const current = new URLSearchParams(searchParams)

    if (filters.created_at) {
      current.set("created_at", JSON.stringify(filters.created_at))
    } else {
      current.delete("created_at")
    }

    if (filters.updated_at) {
      current.set("updated_at", JSON.stringify(filters.updated_at))
    } else {
      current.delete("updated_at")
    }

    navigate({ search: current.toString() }, { replace: true })
  }

  const onClearFilters = () => {
    const current = new URLSearchParams(searchParams)

    current.delete("created_at")
    current.delete("updated_at")

    navigate({ search: current.toString() }, { replace: true })
  }

  const prompt = usePrompt()

  const { mutate, isLoading: isDeletingProductPrices } =
    useAdminPolicyClusterDeletePolicy(policyCluster?.id)

  const handleDeleteProductPrices = async () => {
    const res = await prompt({
      title: "Are you sure?",
      description:
        "This will permanently delete the product prices from the list",
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
    policyCluster.id
  )

  const { data: allPolicy } = useAdminPolicyClusterPolicies(policyCluster.id)

  const onEditPricesModalOpenChange = React.useCallback((open: boolean) => {
    switch (open) {
      case true:
        setShowEditPricesModal(true)
        break
      case false:
        setShowEditPricesModal(false)
        setProductIdsToEdit(null)
        setRowSelection({})
        break
    }
  }, [])

  const onEditAllProductPrices = React.useCallback(() => {
    setProductIdsToEdit(data?.policy_cluster?.map((p) => p.id) as string[])
    setShowEditPricesModal(true)
  }, [allPolicy])

  const onEditSelectedProductPrices = React.useCallback(() => {
    setProductIdsToEdit(Object.keys(rowSelection))
    setShowEditPricesModal(true)
  }, [rowSelection])

  const onEditSingleProductPrices = (id: string) => {
    setProductIdsToEdit([id])
    setShowEditPricesModal(true)
  }

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = usePolicyClusterPolicyColumns({
    onEditProductPrices: onEditSingleProductPrices,
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
      priceListId: policyCluster.id,
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
        <Heading>{"Prices"}</Heading>
        <div className="flex items-center gap-x-2">
          <PolicyFilterMenu
            value={{
              created_at: getDateComparisonOperatorFromSearchParams(
                "created_at",
                searchParams
              ),
              updated_at: getDateComparisonOperatorFromSearchParams(
                "updated_at",
                searchParams
              ),
            }}
            onFilterChange={onFiltersChange}
            onClearFilters={onClearFilters}
          />
          <Input
            type="search"
            size="small"
            placeholder={"Search products"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconButton>
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" side="bottom">
              <DropdownMenu.Item onClick={onEditAllProductPrices}>
                <CurrencyDollar className="text-ui-fg-subtle" />
                <span className="ml-2">{"Edit prices"}</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setShowAddProductsModal(true)}>
                <Tag className="text-ui-fg-subtle" />
                <span className="ml-2">{"Add products"}</span>
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
                "An error occured while fetching the products. Try to reload the page, or if the issue persists, try again later."
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
      {/* <AddProductsModal
        policyIds={(data?.policy_cluster?.map((p) => p.id) as string[]) ?? []}
        // priceList={priceList}
        open={showAddProductsModal}
        onOpenChange={setShowAddProductsModal}
      /> */}
      {/* {productIdsToEdit && (
        <EditPricesModal
          open={showEditPricesModal}
          onOpenChange={onEditPricesModalOpenChange}
          productIds={productIdsToEdit}
          priceList={priceList}
        />
      )} */}
      <CommandBar open={Object.keys(rowSelection).length > 0}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {`${Object.keys(rowSelection).length} selected`}
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            shortcut="e"
            label={"Edit"}
            action={onEditSelectedProductPrices}
            disabled={
              isDeletingProductPrices ||
              showAddProductsModal ||
              showEditPricesModal
            }
          />
          <CommandBar.Seperator />
          <CommandBar.Command
            shortcut="d"
            label={"Delete"}
            action={handleDeleteProductPrices}
            disabled={
              isDeletingProductPrices ||
              showAddProductsModal ||
              showEditPricesModal
            }
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

const columnHelper = createColumnHelper<Policy>()

type UsePriceListProudctColumnsProps = {
  onEditProductPrices: (id: string) => void
}

const usePolicyClusterPolicyColumns = ({
  onEditProductPrices,
}: UsePriceListProudctColumnsProps) => {
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
              aria-label={"Select all products on the current page"}
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
        header: () => "method",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),
      columnHelper.accessor("base_router", {
        header: () => "base router",
        cell: (info) => {
          const variants = info.getValue()
          return variants ?? "-"
        },
      }),

      columnHelper.display({
        id: "actions",
        cell: ({ table, row }) => {
          const { priceListId } = table.options.meta as {
            priceListId: string | undefined
          }

          return (
            <PolicyClusterPolicyrowActions
              row={row}
              priceListId={priceListId}
              onEditProductPrices={onEditProductPrices}
            />
          )
        },
      }),
    ],
    [onEditProductPrices]
  )

  return { columns }
}

type PolicyClusterPolicyRowActionsProps = {
  row: Row<Policy>
  priceListId?: string
  onEditProductPrices: (id: string) => void
}

const PolicyClusterPolicyrowActions = ({
  row,
  priceListId,
  onEditProductPrices,
}: PolicyClusterPolicyRowActionsProps) => {
  //   const { mutateAsync } = useAdminDeletePriceListProductPrices(
  //     priceListId!,
  //     row.original.id
  //   )

  const prompt = usePrompt()

  const onDelete = async () => {
    const response = await prompt({
      title: "Are you sure?",
      description:
        "This will permanently delete the product prices from the list",
    })

    if (!response) {
      return
    }

    // return mutateAsync(undefined, {
    //   onSuccess: ({ deleted }) => {
    //     if (deleted) {
    //       // TODO: Notification
    //     }

    //     if (!deleted) {
    //       // TODO: Notification
    //     }
    //   },
    //   onError: (err) => {
    //     // TODO: Notification
    //   },
    // })
  }

  const onEdit = () => {
    onEditProductPrices(row.original.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" side="bottom">
        <DropdownMenu.Item onClick={onEdit}>
          <PencilSquare className="text-ui-fg-subtle" />
          <span className="ml-2">Edit prices</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onDelete}>
          <Trash className="text-ui-fg-subtle" />
          <span className="ml-2">Delete prices</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export { PolicyClusterPolicySection }
