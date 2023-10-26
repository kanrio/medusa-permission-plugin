import {
  ReactNode,
  HTMLAttributes,
  forwardRef,
  TdHTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
  ThHTMLAttributes,
} from "react"
import TableSearch from "./table-search"
import clsx from "clsx"
import { useNavigate } from "react-router-dom"
import Actionables, { ActionType } from "../actionables"
import SortingIcon from "../icons/sorting-icon"
import FilteringOptions, { FilteringOptionProps } from "./filtering-option"

type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  forceDropdown?: boolean
  actions?: ActionType[]
  linkTo?: string
  clickable?: boolean
}

type TableCellProps = TdHTMLAttributes<HTMLTableCellElement> & {
  linkTo?: string
  name?: string
}

type SortingHeadCellProps = {
  onSortClicked: () => void
  sortDirection?: "ASC" | "DESC"
  setSortDirection: (string) => void
} & HTMLAttributes<HTMLTableCellElement>

export type TableProps = {
  filteringOptions?: FilteringOptionProps[] | ReactNode
  tableActions?: ReactNode
  enableSearch?: boolean
  searchClassName?: string
  immediateSearchFocus?: boolean
  searchPlaceholder?: string
  searchValue?: string
  containerClassName?: string
  handleSearch?: (searchTerm: string) => void
} & HTMLAttributes<HTMLTableElement>

type TableElement<T> = ForwardRefExoticComponent<T> & RefAttributes<unknown>

type TableType = {
  Head: TableElement<HTMLAttributes<HTMLTableSectionElement>>
  HeadRow: TableElement<HTMLAttributes<HTMLTableRowElement>>
  HeadCell: TableElement<ThHTMLAttributes<HTMLTableCellElement>>
  SortingHeadCell: TableElement<SortingHeadCellProps>
  Body: TableElement<HTMLAttributes<HTMLTableSectionElement>>
  Row: TableElement<TableRowProps>
  Cell: TableElement<TableCellProps>
} & TableElement<TableProps>

// eslint-disable-next-line react/display-name
const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      children,
      tableActions,
      enableSearch,
      searchClassName,
      immediateSearchFocus,
      searchPlaceholder,
      searchValue,
      handleSearch,
      filteringOptions,
      containerClassName,
      ...props
    },
    ref
  ) => {
    if (enableSearch && !handleSearch) {
      throw new Error("Table cannot enable search without a search handler")
    }

    return (
      <div className={`flex flex-col ${containerClassName}`}>
        <div className="mb-2 flex w-full justify-between">
          {filteringOptions ? (
            <div className="mb-2 flex self-end">
              {Array.isArray(filteringOptions)
                ? // eslint-disable-next-line react/jsx-key
                  filteringOptions.map((fo) => <FilteringOptions {...fo} />)
                : filteringOptions}
            </div>
          ) : (
            <span aria-hidden />
          )}
          <div className="gap-x-xsmall flex items-center">
            {tableActions && <div>{tableActions}</div>}
            {enableSearch && (
              <TableSearch
                autoFocus={immediateSearchFocus}
                placeholder={searchPlaceholder}
                searchValue={searchValue}
                onSearch={handleSearch!}
                className={searchClassName}
              />
            )}
          </div>
        </div>
        <div className="relative">
          <table
            ref={ref}
            className={clsx("w-full table-auto", className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </div>
    )
  }
) as TableType

// eslint-disable-next-line react/display-name
Table.Head = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <thead
    ref={ref}
    className={clsx(
      "inter-small-semibold text-grey-50 border-grey-20 whitespace-nowrap border-t border-b",
      className
    )}
    {...props}
  >
    {children}
  </thead>
))

// eslint-disable-next-line react/display-name
Table.HeadRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, children, ...props }, ref) => (
  <tr ref={ref} className={clsx(className)} {...props}>
    {children}
  </tr>
))

// eslint-disable-next-line react/display-name
Table.HeadCell = forwardRef<
  HTMLTableCellElement,
  HTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <th ref={ref} className={clsx("h-[40px] text-left", className)} {...props}>
    {children}
  </th>
))

// eslint-disable-next-line react/display-name
Table.SortingHeadCell = forwardRef<HTMLTableCellElement, SortingHeadCellProps>(
  (
    {
      onSortClicked,
      sortDirection,
      setSortDirection,
      className,
      children,
      ...props
    }: SortingHeadCellProps,
    ref
  ) => {
    return (
      <th ref={ref} className={clsx("py-2.5 text-left", className)} {...props}>
        <div
          className="flex cursor-pointer select-none items-center"
          onClick={(e) => {
            e.preventDefault()
            if (!sortDirection) {
              setSortDirection("ASC")
            } else {
              if (sortDirection === "ASC") {
                setSortDirection("DESC")
              } else {
                setSortDirection(undefined)
              }
            }
            onSortClicked()
          }}
        >
          {children}
          <SortingIcon
            size={16}
            ascendingColor={sortDirection === "ASC" ? "#111827" : undefined}
            descendingColor={sortDirection === "DESC" ? "#111827" : undefined}
          />
        </div>
      </th>
    )
  }
)

// eslint-disable-next-line react/display-name
Table.Body = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, children, ...props }, ref) => (
  <tbody ref={ref} className={clsx(className)} {...props}>
    {children}
  </tbody>
))

// eslint-disable-next-line react/display-name
Table.Cell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, linkTo, children, ...props }, ref) => {
    const navigate = useNavigate()
    return (
      <td
        ref={ref}
        className={clsx("inter-small-regular h-[40px]", className)}
        {...props}
        {...(linkTo && {
          onClick: (e) => {
            navigate(linkTo)
            e.stopPropagation()
          },
        })}
      >
        {children}
      </td>
    )
  }
)

// eslint-disable-next-line react/display-name
Table.Row = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      className,
      actions,
      children,
      linkTo,
      forceDropdown,
      clickable,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate()
    return (
      <tr
        ref={ref}
        className={clsx(
          "inter-small-regular border-grey-20 text-grey-90 border-t border-b",
          className,
          {
            "hover:bg-grey-5 cursor-pointer": linkTo !== undefined || clickable,
          }
        )}
        {...props}
        {...(linkTo && {
          onClick: () => {
            navigate(linkTo)
          },
        })}
      >
        {children}
        {actions && (
          <Table.Cell onClick={(e) => e.stopPropagation()} className="w-[32px]">
            <Actionables forceDropdown={forceDropdown} actions={actions} />
          </Table.Cell>
        )}
      </tr>
    )
  }
)

export default Table
