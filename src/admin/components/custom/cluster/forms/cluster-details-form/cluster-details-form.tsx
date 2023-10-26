import { Heading, Input, Text, Textarea, clx } from "@medusajs/ui"

import { Form } from "../../../../shared/form"
import { NestedForm } from "../../../../shared/form/nested-form"
import { ClusterDetailsSchema } from "./types"

interface ClusterDetailsFormProp {
  form: NestedForm<ClusterDetailsSchema>
  layout: "drawer" | "focus"
  enableTaxToggle?: boolean
}

const ClusterDetailsForm = ({
  form,
  layout,
  enableTaxToggle,
}: ClusterDetailsFormProp) => {
  return (
    <div className="flex w-full flex-col gap-y-12">
      <ClusterDetailsGeneral
        form={form}
        layout={layout}
        enableTaxToggle={enableTaxToggle}
      />
    </div>
  )
}

const ClusterDetailsGeneral = ({ form, layout }: ClusterDetailsFormProp) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <Heading level="h2">{"General"}</Heading>
        <Text className="text-ui-fg-subtle">
          {"Choose a cluster name and give a description for new cluster."}
        </Text>
      </div>
      <div
        className={clx("grid gap-4", {
          "grid-cols-1": layout === "drawer",
          "grid-cols-2": layout === "focus",
        })}
      >
        <Form.Field
          control={form.control}
          name={form.path("general.name")}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>{"Name"}</Form.Label>
                <Form.Control>
                  <Input {...field} placeholder={"Agents"} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>
      <Form.Field
        control={form.control}
        name={form.path("general.description")}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{"Description"}</Form.Label>
              <Form.Control>
                <Textarea
                  {...field}
                  placeholder={
                    "This agent cluster can't change products, and can only list orders."
                  }
                />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}

export { ClusterDetailsForm }
