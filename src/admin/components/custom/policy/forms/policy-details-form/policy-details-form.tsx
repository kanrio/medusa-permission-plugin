import { Heading, Input, Text, Textarea, clx } from "@medusajs/ui"
import { NestedForm } from "../../../../shared/form/nested-form"
import { PolicyDetailsSchema } from "./types"
import { Form } from "../../../../shared/form"

interface PolicyDetailsFormProp {
  form: NestedForm<PolicyDetailsSchema>
  layout: "drawer" | "focus"
}

const PolicyDetailsForm = ({ form, layout }: PolicyDetailsFormProp) => {
  return (
    <div className="flex w-full flex-col gap-y-12">
      <PolicyDetailsGeneral form={form} layout={layout} />
    </div>
  )
}

const PolicyDetailsGeneral = ({ form, layout }: PolicyDetailsFormProp) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <Heading level="h2">{"General"}</Heading>
        <Text className="text-ui-fg-subtle">
          {"Create a policy name and give a description for new policy."}
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
                  <Input {...field} placeholder={"Get Product"} />
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
                    "This is our custom get product policy, if this policy attached to the cluster, that policy will have a permission to fetch all products"
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

export { PolicyDetailsForm }
