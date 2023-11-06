import { DateComparisonOperator } from "@medusajs/types"

export const getDateComparisonOperatorFromSearchParams = (
  key: string,
  search: URLSearchParams
): DateComparisonOperator | undefined => {
  const value = search.get(key)

  if (!value) {
    return undefined
  }

  const parsed = JSON.parse(value)

  const acceptedKeys = ["lt", "gt", "gte", "lte"]

  const filtered = Object.keys(parsed).reduce((acc, key) => {
    if (acceptedKeys.includes(key)) {
      acc[key as keyof DateComparisonOperator] = parsed[key]
    }

    return acc
  }, {} as DateComparisonOperator)

  if (Object.keys(filtered).length === 0) {
    return undefined
  }

  const parsedDates = Object.keys(filtered).reduce((acc, key) => {
    if (filtered[key as keyof DateComparisonOperator]) {
      const stringValue = filtered[
        key as keyof DateComparisonOperator
      ] as unknown as string

      acc[key as keyof DateComparisonOperator] = new Date(stringValue)
    }

    return acc
  }, {} as DateComparisonOperator)

  return parsedDates
}

export const getStringFromSearchParams = (
  key: string,
  search: URLSearchParams
): string | undefined => {
  const value = search.get(key)

  if (!value) {
    return undefined
  }

  return value
}
