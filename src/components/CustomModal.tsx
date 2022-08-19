import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  children?: ReactNode
  preventClosure?: boolean
}

export default function CustomModal({
  isOpen,
  onClose,
  children,
  preventClosure,
}: ModalProps) {
  return isOpen ? (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-[100] max-w-[90%] my-0 mx-auto">
      <div
        className="fixed inset-0 bg-black/20"
        onClick={preventClosure ? undefined : onClose}
      ></div>
      <div className="p-8 max-w-full z-[105] my-5 mx-0 rounded-3xl bg-white">
        <div className="flex flex-row items-center justify-end mb-3">
          <FontAwesomeIcon
            className={preventClosure ? '' : 'cursor-pointer'}
            icon={faClose}
            onClick={preventClosure ? undefined : onClose}
          />
        </div>
        {children}
      </div>
    </div>
  ) : (
    <></>
  )
}
