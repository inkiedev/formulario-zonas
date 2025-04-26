"use client";

import {
  Form,
  Input,
  Button,
  Autocomplete,
  AutocompleteItem,
  Radio,
  RadioGroup,
  Divider,
  Textarea,
  addToast
} from "@heroui/react";


import {FormEvent, useEffect, useState} from "react";
import {redirect} from "next/navigation";
import { Asunto } from "@/types/asuntos";
import { Motivo } from "@/types/motivos";
import {Dispositivo} from "@/types/dispositivo";
import {Responsable} from "@/types/responsable";
import {Card, CardBody, CardHeader} from "@heroui/card";
import {Superintendente} from "@/types/superintendente";
import {ValidationResult} from "@react-types/shared";
import {Jefe} from "@/types/jefe";
import {Operador} from "@/types/operador";
import {IncidenteDTO} from "@/dto/incidente.dto";

const validarLista = ({ validationDetails }: ValidationResult) => {
  if (validationDetails.valueMissing) {
    return "Seleccione una opcion de la lista o escriba si no existe";
  }
}

const ETR_TEXT = "Indicar tiempo estimado de atención (ETR), de acuerdo a lo solicitado por la D-DIDIS, Memorando Nro. DIDIS-2024-4024-M"

export default function IncidenteForm(
  { asuntos, motivos, dispositivos, responsables, superintendentes, jefes, operadores}:
  { asuntos: Asunto[], motivos: Motivo[], dispositivos: Dispositivo[], responsables: Responsable[], superintendentes: Superintendente[], jefes: Jefe[], operadores: Operador[] }
) {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [responsableSeleccionado, setResponsableSeleccionado] = useState<Responsable | null>(null);

  useEffect(() => {
    if (responsableSeleccionado) {
      setResponsableSeleccionado(responsableSeleccionado);
    } else {
      setResponsableSeleccionado(null);
    }
  }, [responsableSeleccionado]);

  const filtrar = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }
    textValue = textValue.normalize("NFC").toLocaleLowerCase();
    inputValue = inputValue.normalize("NFC").toLocaleLowerCase();
    return textValue.slice(0, inputValue.length) === inputValue;
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
      id_responsable: responsableSeleccionado?.id,
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

      redirect("/incidentes");
    } else {
      addToast({
        title: "No se registro el incidente",
        description: "Ocurrio un error al registrar el incidente.",
        color: "danger",
        timeout: 3000,
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
        onChange={e => setZonaSeleccionada(e.target.value)}
        name="zona"
        orientation="horizontal"
        >
          <Radio value="Zona 1">Zona 1</Radio>
          <Radio value="Zona 2">Zona 2</Radio>
          <Radio value="Zona 3">Zona 3</Radio>
          <Radio value="Zona 10">Zona 10</Radio>
        </RadioGroup>

        <Input
          label="Incidente"
          labelPlacement="outside"
          name="incidente"
          placeholder="Número de incidente"
          validate={(value: string) => {
            if (value.length !== 10) {
              return "El número de incidente debe tener 10 dígitos";
            }
          }}
        />

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          defaultFilter={filtrar}
          defaultItems={asuntos}
          label="Seleccione el asunto"
          isRequired
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
          placeholder="Número de dispositivo"
        />

        <Autocomplete
          allowsCustomValue
          errorMessage={validarLista}
          isRequired
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
          errorMessage={validarLista}
          defaultFilter={filtrar}
          defaultItems={responsablesFiltrados}
          isDisabled={zonaSeleccionada === null}
          label="Seleccione el alimentador"
          labelPlacement="outside"
          placeholder="Seleccionar alimentador"
          onSelectionChange={(key) => {
            setResponsableSeleccionado(responsables.find(responsable => responsable.id == key as number) as Responsable);
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

        <Card>
          <CardHeader className="flex gap-3">
            <span className="text-md">Responsable del alimentador</span>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>{ responsableSeleccionado?.responsable || "Seleccione el alimentador" }</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3 text-base">
            <span className="text-md">Asistente de Ingenieria</span>
          </CardHeader>
          <Divider />
          <CardBody className="text-base">
            <p>{ responsableSeleccionado?.auxiliar || "Seleccione el alimentador" }</p>
          </CardBody>
        </Card>

        <Input
          isRequired
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

        <Textarea label="Observaciones" labelPlacement="outside" placeholder="Observaciones" name="observaciones"  />

        <RadioGroup errorMessage={({ validationDetails }) => {
          if (validationDetails.valueMissing) {
            return "Seleccione una opcion";
          }
        }} isRequired name="archivo" label="Archivo Fotografico" orientation="horizontal">
          <Radio value="true">Si</Radio>
          <Radio value="false">No</Radio>
        </RadioGroup>

        <Textarea label="ETR" labelPlacement="outside" isReadOnly value={ETR_TEXT} variant="bordered" />

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
