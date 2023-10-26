import { get } from "lodash"
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { Get } from "type-fest"

export type NestedForm<TValues extends FieldValues> = UseFormReturn<{
  __nested__: TValues
}> & {
  path(this: void): `__nested__`
  path<TPath extends FieldPath<TValues>>(
    this: void,
    p?: TPath
  ): `__nested__.${TPath}`
  get<TObj>(this: void, obj: TObj): Get<TObj, `__nested__`>
  get<TPath extends FieldPath<TValues>, TObj>(
    this: void,
    obj: TObj,
    p?: TPath
  ): Get<TObj, `__nested__.${TPath}`>
}

export function nestedForm<TValues extends FieldValues>(
  form: UseFormReturn<TValues> | NestedForm<TValues>
): NestedForm<TValues>
export function nestedForm<
  TValues extends FieldValues,
  TPath extends FieldPath<TValues>,
>(
  form: UseFormReturn<TValues> | NestedForm<TValues>,
  path: TPath
): NestedForm<Get<TValues, TPath>>
export function nestedForm(
  form: UseFormReturn<any> | NestedForm<any>,
  path?: string | number
): NestedForm<any> {
  return {
    ...form,
    path(field?: string | number) {
      const fullPath = path && field ? `${path}.${field}` : path ? path : field

      if ("path" in form) {
        return form.path(path as any)
      }

      return (fullPath || "") as any
    },
    get(obj: any, field?: string | number) {
      const fullPath = path && field ? `${path}.${field}` : path ? path : field

      if ("get" in form) {
        return form.get(path)
      }

      return fullPath ? get(obj, fullPath) : obj
    },
  }
}
