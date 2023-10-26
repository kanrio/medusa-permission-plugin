import { DateComparisonOperator } from "@medusajs/types"
import { FilterMenu } from "../../../shared/filter-menu"

type PolicyFilter = {
  created_at?: DateComparisonOperator
  updated_at?: DateComparisonOperator
}

type PolicyFilterMenuProps = {
  onClearFilters: () => void
  onFilterChange: (filter: PolicyFilter) => void
  value?: PolicyFilter
}

const PolicyFilterMenu = ({
  value,
  onClearFilters,
  onFilterChange,
}: PolicyFilterMenuProps) => {
  const onDateChange = (
    key: "created_at" | "updated_at",
    date?: DateComparisonOperator
  ) => {
    onFilterChange({
      ...value,
      [key as keyof PolicyFilter]: date,
    })
  }

  return (
    <FilterMenu onClearFilters={onClearFilters}>
      <FilterMenu.Content>
        <FilterMenu.DateItem
          name={"Created at"}
          value={value?.created_at}
          onChange={(obj) => onDateChange("created_at", obj)}
        />
        <FilterMenu.Seperator />
        <FilterMenu.DateItem
          name={"Updated at"}
          value={value?.updated_at}
          onChange={(obj) => onDateChange("updated_at", obj)}
        />
      </FilterMenu.Content>
    </FilterMenu>
  )
}

export { PolicyFilterMenu, type PolicyFilter }
