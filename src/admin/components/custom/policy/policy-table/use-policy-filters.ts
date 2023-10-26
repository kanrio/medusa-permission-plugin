import qs from "qs"
import { useMemo, useReducer } from "react"

type PolicyFilterActionProps =
  | {
      type: "setQuery"
      payload: string | null
    }
  | {
      type: "setFilters"
      payload: PolicyFilterState
    }
  | {
      type: "reset"
      payload: PolicyFilterState
    }
  | {
      type: "setOffset"
      payload: number
    }
  | {
      type: "setDefaults"
      payload: PolicyDefaultFilters | null
    }

interface PolicyFilterState {
  query?: string | null
  limit: number
  offset: number
  additionalFilters: PolicyDefaultFilters | null
}

const allowedFilters = ["q", "offset", "limit"]

const reducer = (
  state: PolicyFilterState,
  action: PolicyFilterActionProps
): PolicyFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        query: action?.payload?.query,
      }
    }
    case "setQuery": {
      return {
        ...state,
        offset: 0,
        query: action.payload,
      }
    }
    case "setOffset": {
      return {
        ...state,
        offset: action.payload,
      }
    }
    case "reset": {
      return action.payload
    }
    default: {
      return state
    }
  }
}

type PolicyDefaultFilters = {
  expand?: string
  fields?: string
}

export const usePolicyFilters = (
  existing?: string,
  defaultFilters: PolicyDefaultFilters | null = null
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }

  const initial = useMemo(
    () => parseQueryString(existing, defaultFilters),
    [existing, defaultFilters]
  )

  const [state, dispatch] = useReducer(reducer, initial)

  const setDefaultFilters = (filters: PolicyDefaultFilters | null) => {
    dispatch({ type: "setDefaults", payload: filters })
  }

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: "setOffset", payload: nextOffset })
    } else {
      const nextOffset = Math.max(state.offset - state.limit, 0)
      dispatch({ type: "setOffset", payload: nextOffset })
    }
  }

  const reset = () => {
    dispatch({
      type: "setFilters",
      payload: {
        ...state,
        offset: 0,
        query: null,
      },
    })
  }

  const setFilters = (filters: PolicyFilterState) => {
    dispatch({ type: "setFilters", payload: filters })
  }

  const setQuery = (queryString: string | null) => {
    dispatch({ type: "setQuery", payload: queryString })
  }

  const getQueryObject = () => {
    const toQuery: any = { ...state.additionalFilters }
    for (const [key, value] of Object.entries(state)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      }
    }

    return toQuery
  }

  const getQueryString = () => {
    const obj = getQueryObject()
    return qs.stringify(obj, { skipNulls: true })
  }

  const getRepresentationObject = (fromObject?: PolicyFilterState) => {
    const objToUse = fromObject ?? state

    const toQuery: any = {}
    for (const [key, value] of Object.entries(objToUse)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      }
    }

    return toQuery
  }

  const getRepresentationString = () => {
    const obj = getRepresentationObject()
    return qs.stringify(obj, { skipNulls: true })
  }

  const queryObject = useMemo(() => getQueryObject(), [getQueryObject])
  const representationObject = useMemo(
    () => getRepresentationObject(),
    [getRepresentationObject]
  )
  const representationString = useMemo(
    () => getRepresentationString(),
    [getRepresentationString]
  )

  return {
    ...state,
    filters: {
      ...state,
    },
    representationObject,
    representationString,
    queryObject,
    paginate,
    getQueryObject,
    getQueryString,
    setQuery,
    setFilters,
    setDefaultFilters,
    reset,
  }
}

const parseQueryString = (
  queryString?: string,
  additionals: PolicyDefaultFilters | null = null
): PolicyFilterState => {
  const defaultVal: PolicyFilterState = {
    offset: 0,
    limit: 15,
    additionalFilters: additionals,
  }

  if (queryString) {
    const filters = qs.parse(queryString)
    for (const [key, value] of Object.entries(filters)) {
      if (allowedFilters.includes(key)) {
        switch (key) {
          case "offset": {
            if (typeof value === "string") {
              defaultVal.offset = parseInt(value)
            }
            break
          }
          case "limit": {
            if (typeof value === "string") {
              defaultVal.limit = parseInt(value)
            }
            break
          }
          case "q": {
            if (typeof value === "string") {
              defaultVal.query = value
            }
            break
          }
          default: {
            break
          }
        }
      }
    }
  }

  return defaultVal
}
