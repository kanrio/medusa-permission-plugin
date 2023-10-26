import moment from "moment"
import { useMemo } from "react"
import { Badge, Table } from "@medusajs/ui"
import Tooltip from "../../../shared/tooltip"
import { InformationCircle } from "@medusajs/icons"

export const usePolicyColumn = () => {
  const decideMethod = (status) => {
    switch (status) {
      case "GET":
        return (
          <Badge color="green" rounded="full">
            {status}
          </Badge>
        )
      case "POST":
        return (
          <Badge color="purple" rounded="full">
            {status}
          </Badge>
        )
      case "DELETE":
        return (
          <Badge color="red" rounded="full">
            {status}
          </Badge>
        )
      case "PUT":
        return (
          <Badge color="blue" rounded="full">
            {status}
          </Badge>
        )
      case "PATCH":
        return (
          <Badge color="orange" rounded="full">
            {status}
          </Badge>
        )
      default:
        return (
          <Tooltip content={"This is not a valid schema"}>
            <Badge color="red" rounded="full">
              {status}
            </Badge>
          </Tooltip>
        )
    }
  }

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
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell {...getCellProps()} className="pl-2">
            <div className="flex">
              <div className="pr-2">{value ? "Defined" : "Undefined"}</div>
              {value && (
                <Tooltip content={value}>
                  <InformationCircle className="text-grey-40 flex" />
                </Tooltip>
              )}
            </div>
          </Table.Cell>
        ),
      },
      {
        Header: "Router",
        accessor: "base_router",
        Cell: ({ cell: { value, getCellProps } }) => {
          return (
            <Table.Cell {...getCellProps()}>
              {value ? `/admin/${value}` : "Not defined"}
            </Table.Cell>
          )
        },
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
      {
        Header: "Method",
        accessor: "method",
        Cell: ({ cell: { value, getCellProps } }) => (
          <Table.Cell {...getCellProps()} className="pr-2">
            {decideMethod(value)}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}
