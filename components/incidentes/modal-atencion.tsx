import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  DatePicker,
  addToast
} from "@heroui/react";

import { Incidente } from "@/types/incidente";
import {now, getLocalTimeZone, ZonedDateTime} from "@internationalized/date";
import {useEffect, useState} from "react";

export default function ModalAtencion({ isOpen, onOpenChange, incidente, onSave }: {isOpen: boolean, onOpenChange: (isOpen: boolean) => void, incidente: Incidente | null, onSave: () => void}) {
  const [personal, setPersonal] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [fecha, setFecha] = useState<ZonedDateTime | null>(null);

  useEffect(() => {
    setFecha(now(getLocalTimeZone()))
  }, [isOpen]);

  async function guardar (onClose: () => void) {
    const payload = {
      esta_atendido: true,
      fecha_atencion: fecha?.toDate().toISOString(),
      observaciones_atencion: observaciones,
      operador_atencion: personal
    }

    await fetch("/api/incidentes", {
      method: "PATCH",
      body: JSON.stringify({incidente: incidente?.id, data: payload})
    }).then(res => {
      onClose()

      if (res.status === 200) {
        addToast({
          title: "Actualizado",
          description: "Se actualizo el incidente con exito",
          color: "success",
          timeout: 3000
        })
        onSave()
      } else {
        addToast({
          title: "Ocurrio un error",
          description: "No se pudo actualizar el incidente",
          color: "danger",
          timeout: 3000
        })
      }

      setFecha(now(getLocalTimeZone()))
      setPersonal("")
      setObservaciones("")
    })
  }

  return (

    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Atencion</ModalHeader>
              <ModalBody>
                <Input
                  value={personal}
                  onValueChange={setPersonal}
                  label="Personal"
                  placeholder="Ingrese el personal que atiende"
                  variant="bordered"
                />
                <Textarea
                  value={observaciones}
                  onValueChange={setObservaciones}
                  label="Observaciones"
                  placeholder="Observaciones de la atencion"
                  variant="bordered"
                />
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  value={fecha}
                  onChange={setFecha}
                  label="Fecha de atencion"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => guardar(onClose)}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
