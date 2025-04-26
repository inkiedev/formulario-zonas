"use client"

import {useState, useMemo, useCallback, ChangeEvent} from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination, SharedSelection, SortDescriptor, Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow, useDisclosure,
} from "@heroui/react";
import {Incidente} from "@/types/incidente";
import {useIncidentes} from "@/hooks/use-incidentes";
import ModalAtencion from "@/components/incidentes/modal-atencion";

export const columns = [
  {name: "ITEM", uid: "id", sortable: true},
  {name: "INCIDENTE", uid: "incidente", sortable: true},
  {name: "FECHA", uid: "fecha_creacion",sortable: true, minWidth: "min-w-[10rem]"},
  {name: "ESTADO", uid: "esta_atendido", sortable: true},
  {name: "ASUNTO", uid: "asunto"},
  {name: "MOTIVO", uid: "motivo"},
  {name: "TIPO DE DISPOSITIVO", uid: "dispositivo"},
  {name: "DISPOSITIVO", uid: "nombre_dispositivo"},
  {name: "ATENDIDO POR", uid: "atencion", minWidth: "min-w-[15rem]"},
  {name: "OPERADOR", uid: "operador"},
  {name: "SUPERINTENDENTE", uid: "superintendente"},
  {name: "ALIMENTADOR", uid: "responsables.alimentador"},
  {name: "RESPONSABLE", uid: "responsables.responsable", minWidth: "min-w-[12rem]"},
  {name: "AUXILIAR", uid: "responsables.auxiliar", minWidth: "min-w-[12rem]"},
  {name: "DIRECCION", uid: "direccion"},
  {name: "OBSERVACIONES", uid: "observaciones"},
  {name: "ARCHIVO", uid: "tiene_archivo"},
  {name: "FECHA DE ATENCION", uid: "fecha_atencion"},
  {name: "OBSERVACIONES DE ATENCION", uid: "observaciones_atencion"},
  {name: "PERSONAL QUE ATIENDE", uid: "operador_atencion", minWidth: "min-w-[15rem]"},
  {name: "ZONA", uid: "zona", minWidth: "min-w-[5rem]"},
];

export const statusOptions = [
  {name: "Atendido", uid: "atendido"},
  {name: "Despachado", uid: "despachado"},
];

export function formatearFechaYHora(fecha: string) {
  const date = new Date(fecha);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("es-ES", options);
}

export function capitalize(s: string | null | undefined) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({size = 24, width, height, ...props}: { size?: number, width?: number, height?: number, props?: object }) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M6 12h12" />
        <path d="M12 18V6" />
      </g>
    </svg>
  );
};

export const SearchIcon = (props: object) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export const ChevronDownIcon = ({strokeWidth = 1.5, ...otherProps}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...otherProps}
    >
      <path
        d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default function TablaIncidentes() {
  const {incidentes, loading, refetch }: { incidentes: Incidente[], total: number, loading: boolean, refetch: () => void } = useIncidentes();
  const [filterValue, setFilterValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<SharedSelection>("all");
  const [statusFilter, setStatusFilter] = useState<SharedSelection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [incidente, setIncidente] = useState<Incidente | null>(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...incidentes];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.incidente.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.esta_atendido ? "atendido" : "despachado"),
      );
    }

    return filteredUsers;
  }, [incidentes, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Incidente, b: Incidente) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((incidente: Incidente, columnKey: string) => {
    const cellValue = incidente[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <div>{incidente.id}</div>
        );
      case "incidente":
        return (
          <p className="text-bold text-tiny capitalize">{incidente.incidente}</p>
        );
      case "esta_atendido":
        return (
          <Chip className="capitalize" onClick={() => {
            if (!incidente.esta_atendido) {
              setIncidente(incidente);
              onOpen();
            }
          }} color={incidente.esta_atendido ? "success" : "warning"} size="sm" variant="flat">
            {capitalize(incidente.esta_atendido ? "atendido": "despachado")}
          </Chip>
        );
      case "fecha_creacion":
        return (
          <p className="text-bold text-tiny">{formatearFechaYHora(incidente.fecha_creacion)}</p>
        );
      case "asunto":
        return (
          <p className="text-bold text-tiny">{incidente.asunto}</p>
        );
      case "motivo":
        return (
          <p className="text-bold text-tiny">{incidente.motivo}</p>
        );
      case "dispositivo":
        return (
          <p className="text-bold text-tiny">{incidente.dispositivo}</p>
        );
      case "nombre_dispositivo":
        return (
          <p className="text-bold text-tiny">{incidente.nombre_dispositivo}</p>
        );
      case "atencion":
        return (
          <p className="text-bold text-tiny">{incidente.atencion}</p>
        );
      case "operador":
        return (
          <p className="text-bold text-tiny">{incidente.operador}</p>
        );
      case "superintendente":
        return (
          <p className="text-bold text-tiny">{incidente.superintendente}</p>
        );
      case "responsables.alimentador":
        return (
          <p className="text-bold text-tiny">{incidente.responsables.alimentador}</p>
        );
      case "responsables.responsable":
        return (
          <p className="text-bold text-tiny">{incidente.responsables.responsable}</p>
        );
      case "responsables.auxiliar":
        return (
          <p className="text-bold text-tiny">{incidente.responsables.auxiliar}</p>
        );
      case "direccion":
        return (
          <p className="text-bold text-tiny">{incidente.direccion}</p>
        );
      case "observaciones":
        return (
          <p className="text-bold text-tiny">{incidente.observaciones || "Sin observaciones"}</p>
        );
      case "tiene_archivo":
        return (
          <p className="text-bold text-tiny">{incidente.tiene_archivo ? "Si" : "No"}</p>
        );
      case "fecha_atencion":
        return (
          <p className="text-bold text-tiny">{!incidente.fecha_atencion ? "No atendido": formatearFechaYHora(incidente.fecha_atencion)}</p>
        );
      case "observaciones_atencion":
        return (
          <p className="text-bold text-tiny">{incidente.observaciones_atencion === "NULL" ? "No atendido" : (incidente.observaciones_atencion === "" ? "Sin observaciones" : incidente.observaciones_atencion)}</p>
        );
      case "operador_atencion":
        return (
          <p className="text-bold text-tiny">{incidente.operador_atencion?.length === 0 ? "No atendido" : incidente.operador_atencion}</p>
        );
      case "zona":
        return (
          <p className="text-bold text-tiny">{incidente.zona}</p>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: string | undefined) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por incidente..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Estado de atencion
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de tabla"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={keys => {
                  setStatusFilter(keys);
                  setPage(1);
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de tabla"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={keys => {
                  setVisibleColumns(keys);
                  setPage(1);
                }}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" as={Link} href="/crear" endContent={<PlusIcon />} >
              Agregar incidente
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-small">Total de incidentes: {filteredItems.length}</span>
          <label className="flex items-center text-small">
            Incidentes por pagina:
            <select
              className="ml-1 bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="15">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, statusFilter, visibleColumns, filteredItems.length, onRowsPerPageChange, onClear]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Anterior
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  return <>
    { loading ? <Spinner className="mx-auto w-full" size="lg" /> : <Table
      isHeaderSticky
      aria-label="Tabla de incidentes"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "h-full",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={"center"}
            allowsSorting={column.sortable}
            className={column.minWidth}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Sin incidentes registrados"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table> }
    <ModalAtencion isOpen={isOpen} onOpenChange={onOpenChange} incidente={incidente} onSave={refetch} />
  </>
}

