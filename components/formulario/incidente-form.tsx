"use client";

import {
  Form,
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Radio,
  RadioGroup,
  Textarea,
  addToast, cn
} from "@heroui/react";

import {FormEvent, ReactNode, useState} from "react";
import {redirect} from "next/navigation";
import { Asunto } from "@/types/asuntos";
import { Motivo } from "@/types/motivos";
import {Dispositivo} from "@/types/dispositivo";
import {Responsable} from "@/types/responsable";
import {Superintendente} from "@/types/superintendente";
import {ValidationResult} from "@react-types/shared";
import {Jefe} from "@/types/jefe";
import {Operador} from "@/types/operador";
import {IncidenteDTO} from "@/dto/incidente.dto";
import { useFormularioDirty } from "@/context/formulario-context";
import useUnsavedChangesWarning from "@/hooks/use-cambios-sin-guardar";

const validarLista = ({ validationDetails }: ValidationResult) => {
  if (validationDetails.valueMissing) {
    return "Seleccione una opcion de la lista o escriba si no existe";
  }
}

export default function IncidenteForm(
  { asuntos, motivos, dispositivos, responsables, superintendentes, jefes, operadores}:
  { asuntos: Asunto[], motivos: Motivo[], dispositivos: Dispositivo[], responsables: Responsable[], superintendentes: Superintendente[], jefes: Jefe[], operadores: Operador[] }
) {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [responsableSeleccionado, setResponsableSeleccionado] = useState<Responsable | null>(null);
  const [responsableInput, setResponsableInput] = useState<string>("");
  const [auxiliarInput, setAuxiliarInput] = useState<string>("");
  const { isDirty, setIsDirty } = useFormularioDirty();
  useUnsavedChangesWarning(isDirty);

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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const incidentData = {
      incidente: data.incidente,
      zona: data.zona,
      asunto: data.asunto,
      motivo: data.motivo,
      dispositivo: data.dispositivo,
      nombre_dispositivo: data.nombre_dispositivo,
      atencion: data.jefe,
      operador: data.operador,
      superintendente: data.superintendente,
      alimentador: data.alimentador,
      responsable: responsableInput,
      auxiliar: auxiliarInput,
      direccion: data.direccion,
      observaciones: data.observaciones || null,
      tiene_archivo: data.archivo === "true",
    } as IncidenteDTO;

    const req = await fetch("/api/incidentes", { method: "POST", body: JSON.stringify(incidentData) })

    if (req.status === 200) {
      addToast({
        title: "Incidente registrado",
        description: "El incidente se ha registrado correctamente.",
        color: "success",
        timeout: 3000,
      })

      setIsDirty(false)
      redirect("/");
    } else {
      req.json().then(res => {
        if (res.error) {
          addToast({
            title: "Error",
            description: res.error,
            color: "danger",
            timeout: 3000,
          })
        } else {
          addToast({
            title: "Error",
            description: "Ocurrio un error al registrar el incidente.",
            color: "danger",
            timeout: 3000,
          })
        }
      })
    }
  };

  const responsablesFiltrados = responsables.filter((responsable) => {
    if (!zonaSeleccionada) return true;
    return responsable.zona === zonaSeleccionada;
  });

  return (
    <Form
      className="w-full justify-center items-center space-y-4 p-5 text-base"
      onSubmit={onSubmit}
    >
      <div>
        <h1 className="text-xl font-bold text-center mt-5">Formato para Zona</h1>
      </div>
      <div className="flex flex-col gap-4 max-w-3xl w-full m-10">
        <RadioGroup errorMessage={({ validationDetails }) => {
          if (validationDetails.valueMissing) {
            return "Seleccione una zona";
          }
        }}
        isRequired
        label="Zona"
        onChange={e => {
          setIsDirty(true);
          setZonaSeleccionada(e.target.value)}
        }
        name="zona"
        orientation="horizontal"
        >
          <CustomRadio value="Zona 1">Zona 1</CustomRadio>
          <CustomRadio value="Zona 2">Zona 2</CustomRadio>
          <CustomRadio value="Zona 3">Zona 3</CustomRadio>
          <CustomRadio value="Zona 10">Zona 10</CustomRadio>
          <CustomRadio value="DICO">DICO</CustomRadio>
        </RadioGroup>

        <Input
          label="Incidente"
          labelPlacement="outside"
          name="incidente"
          placeholder="Número de incidente"
          validate={(value: string) => {
            if (value.length > 10 || value.length < 2) {
              return "El número de incidente es invalido";
            }
          }}
          onChange={() => setIsDirty(true)}
        />

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          defaultFilter={filtrar}
          defaultItems={asuntos}
          label="Seleccione el asunto"
          isRequired
          onSelectionChange={() => setIsDirty(true)}
          onInputChange={() => setIsDirty(true)}
          labelPlacement="outside"
          placeholder="Escriba el asunto si no existe"
          variant="bordered"
          name="asunto"
        >
          {(item: Asunto) => <AutocompleteItem key={item.id}>{item.descripcion}</AutocompleteItem>}
        </Autocomplete>

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          defaultFilter={filtrar}
          defaultItems={motivos}
          isRequired
          onSelectionChange={() => setIsDirty(true)}
          onInputChange={() => setIsDirty(true)}
          label="Seleccione el motivo"
          labelPlacement="outside"
          placeholder="Escriba el motivo si no existe"
          variant="bordered"
          name="motivo"
        >
          {(item: Motivo) => <AutocompleteItem key={item.id}>{item.descripcion}</AutocompleteItem>}
        </Autocomplete>

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          defaultFilter={filtrar}
          defaultItems={dispositivos}
          isRequired
          onSelectionChange={() => setIsDirty(true)}
          onInputChange={() => setIsDirty(true)}
          label="Seleccione el dispositivo"
          labelPlacement="outside"
          placeholder="Escriba el dispositivo si no existe"
          variant="bordered"
          name="dispositivo"
        >
          {(item: Dispositivo) => <AutocompleteItem key={item.id}>{item.descripcion}</AutocompleteItem>}
        </Autocomplete>

        <Input
          isRequired
          errorMessage={({ validationDetails }) => {
            if (validationDetails.valueMissing) {
              return "Escriba el dispositivo";
            }
          }}
          label="Dispositivo"
          labelPlacement="outside"
          name="nombre_dispositivo"
          onChange={() => setIsDirty(true)}
          placeholder="Número de dispositivo"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.toUpperCase();
          }}
        />

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          isRequired
          onSelectionChange={() => setIsDirty(true)}
          onInputChange={() => setIsDirty(true)}
          defaultFilter={filtrar}
          defaultItems={jefes}
          label="Atendido por"
          labelPlacement="outside"
          placeholder="Incidente atendido por..."
          variant="bordered"
          name="jefe"
        >
          {(jefe: Jefe)=> (
            <AutocompleteItem key={jefe.id} textValue={`${jefe.grupo} ${jefe.jefe}`}>
              {jefe.grupo} {jefe.jefe}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          isRequired
          onSelectionChange={() => setIsDirty(true)}
          onInputChange={() => setIsDirty(true)}
          defaultFilter={filtrar}
          defaultItems={operadores}
          label="Operador"
          labelPlacement="outside"
          placeholder="Elija el operador o escribalo si no existe"
          variant="bordered"
          name="operador"
        >
          {(operador: Operador)=> (
            <AutocompleteItem key={operador.id}>
              {operador.operador}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          isRequired
          onSelectionChange={() => setIsDirty(true)}
          onInputChange={() => setIsDirty(true)}
          defaultFilter={filtrar}
          defaultItems={superintendentes}
          label="Superintendente/tecnico de turno"
          labelPlacement="outside"
          placeholder="Seleccione de la lista"
          variant="bordered"
          name="superintendente"
        >
          {(superintendente: Superintendente)=> (
            <AutocompleteItem key={superintendente.id}>
              {superintendente.nombre}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
            isRequired
            onInputChange={() => setIsDirty(true)}
            errorMessage={validarLista}
            defaultFilter={filtrar}
            defaultItems={responsablesFiltrados}
            isDisabled={zonaSeleccionada === null}
            label="Seleccione el alimentador"
            labelPlacement="outside"
            placeholder="Seleccionar alimentador"
            onSelectionChange={(key) => {
              const responsable = responsables.find(r => r.id == key as number);
              if (responsable) {
                setResponsableSeleccionado(responsable);
                setResponsableInput(responsable.responsable || "");
                setAuxiliarInput(responsable.auxiliar || "");
              }
              setIsDirty(true);
            }}
            listboxProps={{
              emptyContent: "No hay resultados",
            }}
            variant="bordered"
            name="alimentador"
        >
          {(responsable: Responsable) => (
              <AutocompleteItem key={responsable.id}>
                {responsable.alimentador}
              </AutocompleteItem>
          )}
        </Autocomplete>

        {responsableSeleccionado && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                  isRequired
                  label="Responsable del alimentador"
                  labelPlacement="outside"
                  name="responsable"
                  placeholder="Nombre del responsable"
                  value={responsableInput}
                  onChange={(e) => {
                    setResponsableInput(e.target.value);
                    setIsDirty(true);
                  }}
              />

              <Input
                  label="Asistente de Ingeniería"
                  labelPlacement="outside"
                  name="auxiliar"
                  placeholder="Nombre del auxiliar"
                  value={auxiliarInput}
                  onChange={(e) => {
                    setAuxiliarInput(e.target.value);
                    setIsDirty(true);
                  }}
              />
            </div>
        )}

        <Input
          isRequired
          onChange={() => setIsDirty(true)}
          errorMessage={({ validationDetails }) => {
            if (validationDetails.valueMissing) {
              return "Ingrese la direccion";
            }
          }}
          label="Direccion"
          labelPlacement="outside"
          name="direccion"
          placeholder="Direccion del incidente"
        />

        <Textarea label="Observaciones" onChange={() => setIsDirty(true)} labelPlacement="outside" placeholder="Observaciones" name="observaciones"  />

        <RadioGroup errorMessage={({ validationDetails }) => {
          if (validationDetails.valueMissing) {
            return "Seleccione una opcion";
          }
        }} isRequired onChange={() => setIsDirty(true)} name="archivo" label="Archivo Fotografico" orientation="horizontal">
          <Radio value="true">Si</Radio>
          <Radio value="false">No</Radio>
        </RadioGroup>

        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit" variant="bordered">
            Registrar
          </Button>
          <Button type="reset" onPress={() => setZonaSeleccionada(null)} variant="bordered">
            Reiniciar
          </Button>
        </div>
      </div>
    </Form>
  );
}

export const CustomRadio = ({ children, value }: { children: ReactNode, value: string }) => {
  return (
    <Radio
      value={value}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};
