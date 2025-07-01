import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast, Textarea
} from "@heroui/react";

import { Incidente } from "@/types/incidente";
import {useEffect, useState} from "react";

export default function ModalEditar({ isOpen, onOpenChange, incidente, onSave }: {isOpen: boolean, onOpenChange: (isOpen: boolean) => void, incidente: Incidente | null, onSave: () => void}) {
  const [valorIncidente, setValorIncidente] = useState<string>("");
  const [nombreDispositivo, setNombreDispositivo] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");

  useEffect(() => {
    if (incidente) {
      setValorIncidente(incidente.incidente);
      setNombreDispositivo(incidente.nombre_dispositivo);
      setObservaciones(incidente.observaciones || "");
    }
  }, [isOpen, incidente]);

  async function guardar (onClose: () => void) {
    const payload = {
      incidente: valorIncidente,
      observaciones: observaciones,
      nombre_dispositivo: nombreDispositivo,
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

      setNombreDispositivo("")
      setValorIncidente("")
    })
  }

  return (

    <>
      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Editar incidente</ModalHeader>
              <ModalBody>
                <Input
                  value={valorIncidente}
                  onValueChange={setValorIncidente}
                  label="Incidente"
                  placeholder="Ingrese el nuevo numero de incidente"
                  variant="bordered"
                />
                <Input
                  value={nombreDispositivo}
                  onValueChange={setNombreDispositivo}
                  label="Nombre del dispositivo"
                  placeholder="Ingrese el nuevo nombre del dispositivo"
                  variant="bordered"
                />
                <Textarea
                  value={observaciones}
                  onValueChange={setObservaciones}
                  label="Observaciones"
                  placeholder="Observaciones de la atencion"
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
