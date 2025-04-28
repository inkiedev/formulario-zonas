import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

import { Incidente } from "@/types/incidente";
import {formatearFechaYHora} from "@/components/incidentes/tabla-incidentes";

export default function ModalIncidente({ isOpen, onOpenChange, incidente }: {isOpen: boolean, onOpenChange: (isOpen: boolean) => void, incidente: Incidente | null}) {
  return (

    <>
      <Modal size="5xl"   isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col">Item: {incidente?.id}</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 grid-rows-8 w-full min-h-[60vh] mb-4">
                  <div>
                    <p className="text-sm font-semibold">Incidente</p>
                    <p className="text-sm">{incidente?.incidente}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fecha</p>
                    <p className="text-sm">{formatearFechaYHora(incidente?.fecha_creacion || "")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Asunto</p>
                    <p className="text-sm">{incidente?.asunto}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Motivo</p>
                    <p className="text-sm">{incidente?.motivo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Tipo de Dispositivo</p>
                    <p className="text-sm">{incidente?.dispositivo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Dispositivo</p>
                    <p className="text-sm">{incidente?.nombre_dispositivo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Reportado por</p>
                    <p className="text-sm">{incidente?.atencion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Operador</p>
                    <p className="text-sm">{incidente?.operador}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Superintendente</p>
                    <p className="text-sm">{incidente?.superintendente}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Alimentador</p>
                    <p className="text-sm">{incidente?.responsables?.alimentador}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Responsable</p>
                    <p className="text-sm">{incidente?.responsables?.responsable}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Auxiliar</p>
                    <p className="text-sm">{incidente?.responsables?.auxiliar}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Direccion</p>
                    <p className="text-sm">{incidente?.direccion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Observaciones</p>
                    <p className="text-sm">{incidente?.observaciones}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Archivo Fotografico</p>
                    <p className="text-sm">{incidente?.tiene_archivo ? "Si" : "No"}</p>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
