import { Heading, Input, Text, clx } from "@medusajs/ui"
import { NestedForm } from "../../../../shared/form/nested-form"
import { Form } from "../../../../shared/form"
import { PolicySettingsSchema } from "./types"

interface PolicySettingsFormProp {
  form: NestedForm<PolicySettingsSchema>
  layout: "drawer" | "focus"
}

const PolicySettingsForm = ({ form, layout }: PolicySettingsFormProp) => {
  return (
    <div className="flex w-full flex-col gap-y-12">
      <PolicySettingsFormComponent form={form} layout={layout} />
    </div>
  )
}

const PolicySettingsFormComponent = ({
  form,
  layout,
}: PolicySettingsFormProp) => {
  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <Heading level="h2">{"Settings"}</Heading>
        <Text className="text-ui-fg-subtle">
          {
            "Give a base router and method for this policy, the permission middleware will listen this router"
          }
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
          name={form.path("settings.base_router")}
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>{"Base Router"}</Form.Label>
                <Form.Control>
                  <Input {...field} placeholder={"products"} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )
          }}
        />
      </div>

      <Form.Field
        control={form.control}
        name={form.path("settings.method")}
        render={({ field }) => {
          return (
            <Form.Item>
              <Form.Label>{"Method"}</Form.Label>
              <Form.Control>
                <Input {...field} placeholder={"GET"} />
              </Form.Control>
              <Form.ErrorMessage />
            </Form.Item>
          )
        }}
      />
    </div>
  )
}

export { PolicySettingsForm }
