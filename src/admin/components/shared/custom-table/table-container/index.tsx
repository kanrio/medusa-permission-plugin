import { Spinner } from "@medusajs/icons"
import { PropsWithChildren } from "react"
import { TablePagination } from "./pagination"
import { PagingProps } from "./types"

const ROW_HEIGHT = 40

type Props<T extends boolean> = PropsWithChildren<{
  isLoading?: boolean
  hasPagination?: T
  pagingState: T extends true ? PagingProps : undefined
  numberOfRows?: number
}>

const TableContainer = <T extends boolean>({
  children,
  hasPagination,
  pagingState,
  isLoading,
  numberOfRows = 12,
}: Props<T>) => {
  const minHeight = (numberOfRows + 1) * ROW_HEIGHT

  return (
    <div>
      <div
        className="relative"
        style={{
          minHeight,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
            <Spinner />
          </div>
        )}
        {children}
      </div>
      {hasPagination && pagingState && (
        <div className="mt-14">
          <TablePagination pagingState={pagingState} isLoading={isLoading} />
        </div>
      )}
    </div>
  )
}

export default TableContainer
