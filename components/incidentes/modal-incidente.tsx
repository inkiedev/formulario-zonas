import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

import "./modal-incidente.css"

import { Incidente } from "@/types/incidente";
import {formatearFechaYHora} from "@/utils/table-utils";

export default function ModalIncidente({ isOpen, onOpenChange, incidente }: {isOpen: boolean, onOpenChange: (isOpen: boolean) => void, incidente: Incidente | null}) {
  return (
    <>
      <Modal size="5xl"   isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col">FORMULARIO: {incidente?.numero_item}</ModalHeader>
              <ModalBody>
                <div>
                  <div className="incidente-container w-full mb-5 min-h-[50vh]">
                    <div>
                      <p className="text-sm font-semibold">Fecha</p>
                      <p className="text-sm">{formatearFechaYHora(incidente?.fecha_creacion || "")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Ingeniero de turno</p>
                      <p className="text-sm">{incidente?.superintendente}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Incidente</p>
                      <p className="text-sm">{incidente?.incidente}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Alimentador</p>
                      <p className="text-sm">{incidente?.alimentador}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Asunto</p>
                      <p className="text-sm">{incidente?.asunto}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Responsable</p>
                      <p className="text-sm">{incidente?.responsable}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Motivo</p>
                      <p className="text-sm">{incidente?.motivo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Auxiliar</p>
                      <p className="text-sm">{incidente?.auxiliar || "Sin auxiliar"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Dispositivo Afectado</p>
                      <p className="text-sm">{incidente?.dispositivo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Numero de dispositivo</p>
                      <p className="text-sm">{incidente?.nombre_dispositivo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Reportado por</p>
                      <p className="text-sm">{incidente?.atencion}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Direccion</p>
                      <p className="text-sm">{incidente?.direccion}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Operador</p>
                      <p className="text-sm">{incidente?.operador}</p>
                    </div>
                    <div className="row-span-2">
                      <p className="text-sm font-semibold">Observaciones</p>
                      <p className="text-sm">{incidente?.observaciones}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Archivo Fotografico</p>
                      <p className="text-sm">{incidente?.tiene_archivo ? "Si" : "No"}</p>
                    </div>
                  </div>
                  <div className="mb-4 border-2 border-purple-400 rounded-xl p-2 font-semibold">
                    <h2>ETR</h2>
                    <p>
                      Indicar tiempo estimado de atención (ETR), de acuerdo a lo solicitado por la D-DIDIS, Memorando Nro. DIDIS-2024-4024-M
                    </p>
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
