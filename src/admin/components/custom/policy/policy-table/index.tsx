import { Fragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import TableContainer from "../../../shared/custom-table/table-container"
import { usePolicyFilters } from "./use-policy-filters"
import Table from "../../../shared/custom-table"
import { useAdminPolicy } from "../../../hooks/policy"
import { usePolicyColumn } from "./use-policy-columns"
import usePolicyActions from "../use-policy-actions"
import policy from "../../../hooks/policy/"

const DEFAULT_PAGE_SIZE = 15

const PolicyTable = () => {
  const location = useLocation()

  const {
    reset,
    paginate,
    setQuery: setFreeText,
    queryObject,
  } = usePolicyFilters(location.search, {})

  const filtersOnLoad = queryObject

  const offs = parseInt(filtersOnLoad?.offset) || 0
  const lim = parseInt(filtersOnLoad?.limit) || DEFAULT_PAGE_SIZE

  const [query, setQuery] = useState(filtersOnLoad?.query)
  const [numPages, setNumPages] = useState(0)

  const { data, isLoading, isRefetching, count } = useAdminPolicy(queryObject)

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / queryObject.limit)
    setNumPages(controlledPageCount)
  }, [count, queryObject])

  const [columns] = usePolicyColumn()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useTable(
    {
      columns,
      data: data?.policy ?? [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query)
        gotoPage(0)
      } else {
        reset()
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  const { getActions } = usePolicyActions(policy)
  return (
    <>
      <TableContainer
        hasPagination
        numberOfRows={DEFAULT_PAGE_SIZE}
        pagingState={{
          count: count!,
          offset: queryObject.offset,
          pageSize: queryObject.offset + rows.length,
          title: "Policy",
          currentPage: pageIndex + 1,
          pageCount: pageCount,
          nextPage: handleNext,
          prevPage: handlePrev,
          hasNext: canNextPage,
          hasPrev: canPreviousPage,
        }}
        isLoading={isLoading || isRefetching}
      >
        <Table
          filteringOptions={[]}
          enableSearch
          handleSearch={setQuery}
          searchValue={query}
          {...getTableProps()}
        >
          <Table.Head>
            {headerGroups?.map((headerGroup) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col, index) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <Table.HeadCell
                        className="w-[100px]"
                        {...col.getHeaderProps()}
                      >
                        {col.render("Header", { customIndex: index })}
                      </Table.HeadCell>
                    )
                  })}
                </Table.HeadRow>
              )
            })}
          </Table.Head>
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)

              return (
                // eslint-disable-next-line react/jsx-key
                <PolicyRow row={row} {...row.getRowProps()} />
              )
            })}
          </Table.Body>
        </Table>
      </TableContainer>
    </>
  )
}

const PolicyRow = ({ row, ...rest }) => {
  const policy = row.original
  const { getActions } = usePolicyActions(policy)

  return (
    <Table.Row color={"inherit"} actions={getActions()} {...rest}>
      {row.cells.map((cell, index) => {
        return (
          // eslint-disable-next-line react/jsx-key
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell", { index })}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export default PolicyTable
