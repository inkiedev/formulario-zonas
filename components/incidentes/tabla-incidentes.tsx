"use client"

import { useState, useMemo, useCallback, memo, lazy, Suspense } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination,
  Radio,
  RadioGroup,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { Incidente } from "@/types/incidente";
import { useIncidentes } from "@/hooks/use-incidentes";
import { useDebounce } from "@/hooks/use-debounce";
import { useTableFilters, useTablePagination, useTableColumns } from "@/hooks/use-table-logic";
import { columns, statusOptions, zonasOptions } from "@/config/table-config";
import { formatearFechaYHora, ellipsisText, capitalize } from "@/utils/table-utils";
import {SearchIcon, ChevronDownIcon, PlusIcon, EyeIcon, EditIcon} from "@/components/icons";
import {Column} from "@/types";
import ModalEditar from "@/components/incidentes/modal-editar";

const ModalAtencion = lazy(() => import('@/components/incidentes/modal-atencion'));
const ModalIncidente = lazy(() => import('@/components/incidentes/modal-incidente'));

const StatusChip = memo(({
                           incidente,
                           onOpen,
                           setIncidente
                         }: {
  incidente: Incidente;
  onOpen: () => void;
  setIncidente: (inc: Incidente) => void;
}) => (
  <Chip
    className="capitalize cursor-pointer"
    onClick={() => {
      if (!incidente.esta_atendido) {
        setIncidente(incidente);
        onOpen();
      }
    }}
    color={incidente.esta_atendido ? "success" : "warning"}
    size="sm"
    variant="flat"
  >
    {capitalize(incidente.esta_atendido ? "atendido" : "despachado")}
  </Chip>
));

StatusChip.displayName = 'StatusChip';

export default function TablaIncidentes() {
  const filters = useTableFilters();
  const pagination = useTablePagination(10);
  const tableColumns = useTableColumns(columns as Column[]);

  const debouncedSearchValue = useDebounce(filters.filterValue, 300);

  const statusFilterArray = filters.statusFilter === "all" ? "all" : Array.from(filters.statusFilter);
  const zonaFilterArray = filters.zonaFilter === "all" ? "all" : Array.from(filters.zonaFilter);

  const { incidentes, total, loading, error, refetch } = useIncidentes({
    page: pagination.page,
    limit: pagination.rowsPerPage,
    search: debouncedSearchValue,
    searchType: filters.filter as "incidente" | "dispositivo",
    statusFilter: statusFilterArray,
    zonaFilter: zonaFilterArray,
    sortBy: tableColumns.sortDescriptor.column as string,
    sortDirection: tableColumns.sortDescriptor.direction === "descending" ? "desc" : "asc"
  });

  console.log(incidentes)

  const [incidente, setIncidente] = useState<Incidente | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpenIncidente, onOpen: onOpenIncidente, onOpenChange: onOpenChangeIncidente } = useDisclosure();
  const { isOpen: isOpenEditar, onOpen: onOpenEditar, onOpenChange: onOpenChangeEditar } = useDisclosure();

  const pages = Math.ceil(total / pagination.rowsPerPage);

  const renderCell = useCallback((incidente: Incidente, columnKey: string) => {
    switch (columnKey) {
      case "numero_item":
        return (
          <p className="text-bold text-tiny">
            {incidente.numero_item}
          </p>
        );
      case "esta_atendido":
        return (
          <StatusChip
            incidente={incidente}
            onOpen={onOpen}
            setIncidente={setIncidente}
          />
        );
      case "tiene_archivo":
        return (
          <p className="text-bold text-tiny">
            {incidente.tiene_archivo ? "Sí" : "No"}
          </p>
        );
      case "fecha_creacion":
        return (
          <p className="text-bold text-tiny">
            {formatearFechaYHora(incidente.fecha_creacion)}
          </p>
        );
      case "observaciones":
        return (
          <p className="text-bold text-tiny">
            {ellipsisText(incidente.observaciones || "", 60) || "Sin observaciones"}
          </p>
        );
      case "fecha_atencion":
        return (
          <p className="text-bold text-tiny">
            {!incidente.fecha_atencion ? "No atendido" : formatearFechaYHora(incidente.fecha_atencion)}
          </p>
        );
      case "observaciones_atencion":
        return (
          <p className="text-bold text-tiny">
            {incidente.observaciones_atencion === "NULL"
              ? "No atendido"
              : (incidente.observaciones_atencion === ""
                  ? "Sin observaciones"
                  : ellipsisText(incidente.observaciones_atencion || "", 60)
              )
            }
          </p>
        );
      case "responsables.alimentador":
        return <p className="text-bold text-tiny">{incidente.alimentador}</p>;
      case "responsables.responsable":
        return <p className="text-bold text-tiny">{incidente.responsable}</p>;
      case "responsables.auxiliar":
        return <p className="text-bold text-tiny">{incidente.auxiliar || "Sin auxiliar"}</p>;
      case "operador_atencion":
        return (
          <p className="text-bold text-tiny">
            {incidente.operador_atencion || "Sin operador"}
          </p>
        );
      case "acciones":
        return (
          <div className="relative flex justify-center items-center gap-2">
            <button
              onClick={() => {
              setIncidente(incidente);
              onOpenIncidente();
            }}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </button>
            <button
              onClick={() => {
                setIncidente(incidente);
                onOpenEditar()
              }}
            >
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </button>
          </div>
        );
      default:
        const cellValue = incidente[columnKey as keyof Incidente];
        return (
          <p className="text-bold text-tiny">
            {String(cellValue || '')}
          </p>
        );
    }
  }, [onOpen, onOpenEditar, onOpenIncidente]);

  const tableClassNames = useMemo(() => ({
    wrapper: "h-full",
    tr: "max-h-[1rem]",
  }), []);

  const emptyContent = useMemo(() => "Sin incidentes registrados", []);

  const topContent = useMemo(() => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <div className="flex justify-items-start gap-5 items-end flex-grow">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] flex-grow"
            placeholder={`Buscar por ${filters.filter === 'incidente' ? 'incidente' : 'dispositivo'}...`}
            startContent={<SearchIcon />}
            value={filters.filterValue}
            onClear={filters.onClear}
            onValueChange={filters.onSearchChange}
          />
          <RadioGroup
            className="flex-shrink"
            label="Tipo de filtro"
            name="filtro"
            value={filters.filter}
            orientation="horizontal"
            onChange={e => {
              filters.setFilter(e.target.value);
              filters.onClear();
            }}
          >
            <Radio value="incidente">Incidente</Radio>
            <Radio value="dispositivo">Dispositivo</Radio>
          </RadioGroup>
        </div>

        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                Filtro de atención
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filtro de estado"
              closeOnSelect={false}
              selectedKeys={filters.statusFilter}
              selectionMode="multiple"
              onSelectionChange={keys => {
                filters.setStatusFilter(keys);
                pagination.resetPagination();
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
                Filtro de zona
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Filtro de zona"
              closeOnSelect={false}
              selectedKeys={filters.zonaFilter}
              selectionMode="multiple"
              onSelectionChange={keys => {
                filters.setZonaFilter(keys);
                pagination.resetPagination();
              }}
            >
              {zonasOptions.map((zona) => (
                <DropdownItem key={zona.uid}>
                  {zona.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                Visibilidad de Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Columnas de tabla"
              closeOnSelect={false}
              selectedKeys={tableColumns.visibleColumns}
              selectionMode="multiple"
              onSelectionChange={tableColumns.setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button color="primary" as={Link} href="/crear" endContent={<PlusIcon />}>
            Agregar incidente
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-small">Total de incidentes: {total}</span>
        <label className="flex items-center text-small">
          Incidentes por página:
          <select
            className="ml-1 bg-transparent outline-none text-default-400 text-small"
            onChange={pagination.onRowsPerPageChange}
            value={pagination.rowsPerPage}
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
    </div>
  ), [filters, pagination, tableColumns, total]);

  const bottomContent = useMemo(() => (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={pagination.page}
        total={pages}
        onChange={pagination.setPage}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          isDisabled={pagination.page === 1}
          size="sm"
          variant="flat"
          onPress={pagination.onPreviousPage}
        >
          Anterior
        </Button>
        <Button
          isDisabled={pagination.page >= pages}
          size="sm"
          variant="flat"
          onPress={() => pagination.onNextPage(pages)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  ), [pagination, pages]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button color="primary" onPress={refetch}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <Spinner className="mx-auto w-full" size="lg" />
      ) : (
        <Table
          isHeaderSticky
          isStriped
          aria-label="Tabla de incidentes"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={tableClassNames}
          sortDescriptor={tableColumns.sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={(descriptor) => {
            tableColumns.setSortDescriptor(descriptor);
            pagination.resetPagination();
          }}
        >
          <TableHeader columns={tableColumns.headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align="center"
                allowsSorting={column.sortable}
                className={column.minWidth}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={emptyContent} items={incidentes}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(item, columnKey as string)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Suspense fallback={<Spinner />}>
        <ModalAtencion
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          incidente={incidente}
          onSave={refetch}
        />
        <ModalIncidente
          isOpen={isOpenIncidente}
          onOpenChange={onOpenChangeIncidente}
          incidente={incidente}
        />

        <ModalEditar
          isOpen={isOpenEditar}
          onOpenChange={onOpenChangeEditar}
          incidente={incidente}
          onSave={refetch}
        />
      </Suspense>
    </>
  );
}
