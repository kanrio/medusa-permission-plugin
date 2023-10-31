import React, { useState } from "react"
import { createRoot } from "react-dom/client"
import { Input } from "@medusajs/ui"
import Modal from "../../shared/modal"
import Button from "../../shared/button"

const DeleteDialog = ({
  open,
  heading,
  text,
  onConfirm,
  onCancel,
  confirmText = "Yes, confirm",
  cancelText = "Cancel",
  extraConfirmation = false,
  entityName,
}) => {
  const [confirmationString, setConfirmationString] = useState<string>()

  return (
    <Modal open={open} handleClose={onCancel} isLargeModal={false}>
      <Modal.Body>
        <Modal.Content className="!py-large">
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="inter-base-regular text-grey-50 mt-1">{text}</span>
          </div>
          {extraConfirmation && (
            <div className="my-base flex flex-col">
              <span className="inter-base-regular text-grey-50 mt-1">
                Type the name{" "}
                <span className="font-semibold">"{entityName}"</span> to
                confirm.
              </span>
              <Input
                autoFocus={true}
                placeholder={entityName}
                className={"mt-base"}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmationString(event.target.value)
                }
              />
            </div>
          )}
        </Modal.Content>
        <Modal.Footer className="border-none !pt-0">
          <div className="flex w-full justify-end">
            <Button
              variant="secondary"
              className="text-small mr-2 justify-center"
              size="small"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              size="small"
              className="text-small justify-center"
              variant="nuclear"
              onClick={onConfirm}
              disabled={extraConfirmation && entityName !== confirmationString}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

type ImperativeDialogProps = {
  heading: string
  text: string
  confirmText?: string
  cancelText?: string
} & (
  | {
      extraConfirmation: true
      entityName: string
    }
  | {
      extraConfirmation?: false
      entityName?: never
    }
)

const useImperativeDialog = () => {
  return ({
    heading,
    text,
    confirmText,
    cancelText,
    extraConfirmation,
    entityName,
  }: ImperativeDialogProps): Promise<boolean> => {
    return new Promise((resolve) => {
      const mountRoot = createRoot(document.createElement("div"))
      let open = true

      const onConfirm = () => {
        open = false
        resolve(true)
        render()
      }

      const onCancel = () => {
        open = false
        resolve(false)
        render()
      }

      const render = () => {
        mountRoot.render(
          <DeleteDialog
            heading={heading}
            text={text}
            open={open}
            onCancel={onCancel}
            onConfirm={onConfirm}
            confirmText={confirmText}
            cancelText={cancelText}
            extraConfirmation={extraConfirmation}
            entityName={entityName}
          />
        )
      }

      render()
    })
  }
}

export default useImperativeDialog
