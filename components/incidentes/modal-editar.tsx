import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
  Textarea,
  Autocomplete,
  AutocompleteItem,
  Spinner
} from "@heroui/react";

import { Incidente } from "@/types/incidente";
import { useEffect, useState } from "react";
import { useFormData } from "@/hooks/use-form-data";
import { Superintendente } from "@/types/superintendente";
import { Jefe } from "@/types/jefe";
import { Operador } from "@/types/operador";

export default function ModalEditar({
                                      isOpen,
                                      onOpenChange,
                                      incidente,
                                      onSave
                                    }: {
  isOpen: boolean,
  onOpenChange: (isOpen: boolean) => void,
  incidente: Incidente | null,
  onSave: () => void
}) {
  const [valorIncidente, setValorIncidente] = useState<string>("");
  const [nombreDispositivo, setNombreDispositivo] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("");
  const [atencion, setAtencion] = useState<string>("");
  const [operador, setOperador] = useState<string>("");
  const [superintendente, setSuperintendente] = useState<string>("");

  // Hook para obtener datos de las tablas
  const { superintendentes, jefes, operadores, loading: loadingData, error: errorData } = useFormData();

  useEffect(() => {
    if (incidente) {
      setValorIncidente(incidente.incidente);
      setNombreDispositivo(incidente.nombre_dispositivo);
      setObservaciones(incidente.observaciones || "");
      setAtencion(incidente.atencion || "");
      setOperador(incidente.operador || "");
      setSuperintendente(incidente.superintendente || "");
    }
  }, [isOpen, incidente]);

  const filtrar = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }
    const normalizeText = (text: string) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();

    textValue = normalizeText(textValue);
    inputValue = normalizeText(inputValue);

    return textValue.includes(inputValue);
  };

  async function guardar(onClose: () => void) {
    const payload = {
      incidente: valorIncidente,
      observaciones: observaciones,
      nombre_dispositivo: nombreDispositivo,
      atencion: atencion,
      operador: operador,
      superintendente: superintendente,
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
      setObservaciones("")
      setAtencion("")
      setOperador("")
      setSuperintendente("")
    })
  }

  if (errorData) {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody className="text-center p-6">
            <p className="text-red-500">Error al cargar los datos: {errorData}</p>
            <Button color="primary" onPress={() => onOpenChange(false)}>
              Cerrar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar incidente
              </ModalHeader>
              <ModalBody className="gap-4">
                {loadingData ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner size="lg" />
                    <span className="ml-2">Cargando datos...</span>
                  </div>
                ) : (
                  <>
                    <Input
                      value={valorIncidente}
                      onValueChange={setValorIncidente}
                      label="Incidente"
                      placeholder="Ingrese el nuevo numero de incidente"
                      variant="bordered"
                      isRequired
                    />

                    <Input
                      value={nombreDispositivo}
                      onValueChange={setNombreDispositivo}
                      label="Nombre del dispositivo"
                      placeholder="Ingrese el nuevo nombre del dispositivo"
                      variant="bordered"
                      isRequired
                    />

                    <Autocomplete
                      isRequired
                      allowsCustomValue
                      defaultFilter={filtrar}
                      defaultItems={jefes}
                      label="Atendido por"
                      labelPlacement="outside"
                      placeholder="Persona o grupo que atiende el incidente"
                      variant="bordered"
                      inputValue={atencion}
                      onInputChange={setAtencion}
                    >
                      {(jefe: Jefe) => (
                        <AutocompleteItem key={jefe.id} textValue={`${jefe.grupo} ${jefe.jefe}`}>
                          {jefe.grupo} {jefe.jefe}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>

                    <Autocomplete
                      isRequired
                      allowsCustomValue
                      defaultFilter={filtrar}
                      defaultItems={operadores}
                      label="Operador"
                      labelPlacement="outside"
                      placeholder="Seleccione o escriba el operador"
                      variant="bordered"
                      inputValue={operador}
                      onInputChange={setOperador}
                    >
                      {(operador: Operador) => (
                        <AutocompleteItem key={operador.id}>
                          {operador.operador}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>

                    <Autocomplete
                      isRequired
                      allowsCustomValue
                      defaultFilter={filtrar}
                      defaultItems={superintendentes}
                      label="Superintendente"
                      labelPlacement="outside"
                      placeholder="Seleccione o escriba el superintendente"
                      variant="bordered"
                      inputValue={superintendente}
                      onInputChange={setSuperintendente}
                    >
                      {(superintendente: Superintendente) => (
                        <AutocompleteItem key={superintendente.id}>
                          {superintendente.nombre}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>

                    <Textarea
                      value={observaciones}
                      onValueChange={setObservaciones}
                      label="Observaciones"
                      placeholder="Observaciones del incidente"
                      variant="bordered"
                      minRows={3}
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={() => guardar(onClose)}
                  isDisabled={!valorIncidente.trim() || !nombreDispositivo.trim() || loadingData}
                >
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
