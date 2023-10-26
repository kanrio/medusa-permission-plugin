import moment from "moment"
import { useMemo } from "react"
import { Table } from "@medusajs/ui"

const useClusterColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell
            {...getCellProps()}
            className="pl-2"
          >{`${value}`}</Table.Cell>
        ),
      },
      {
        Header: "Date Added",
        accessor: "created_at",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell {...getCellProps()}>
            {moment(value).format("DD MMM YYYY")}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useClusterColumn
