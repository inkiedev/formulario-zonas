import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { SharedSelection, SortDescriptor } from "@heroui/react";
import {Column} from "@/types";

export function useTableFilters() {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<SharedSelection>("all");
  const [zonaFilter, setZonaFilter] = useState<SharedSelection>("all");
  const [filter, setFilter] = useState<string>("incidente");

  const onSearchChange = useCallback((value: string | undefined) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const resetFilters = useCallback(() => {
    setFilterValue("");
    setStatusFilter("all");
    setZonaFilter("all");
    setFilter("incidente");
  }, []);

  return {
    filterValue,
    statusFilter,
    zonaFilter,
    filter,
    setFilterValue,
    setStatusFilter,
    setZonaFilter,
    setFilter,
    onSearchChange,
    onClear,
    resetFilters
  };
}

export function useTablePagination(initialRowsPerPage: number = 10) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onNextPage = useCallback((totalPages: number) => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const resetPagination = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    onRowsPerPageChange,
    onNextPage,
    onPreviousPage,
    resetPagination
  };
}

export function useTableColumns(columns: Column[]) {
  const [visibleColumns, setVisibleColumns] = useState<SharedSelection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "fecha_creacion",
    direction: "descending"
  });

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, columns]);

  return {
    visibleColumns,
    sortDescriptor,
    headerColumns,
    setVisibleColumns,
    setSortDescriptor
  };
}
