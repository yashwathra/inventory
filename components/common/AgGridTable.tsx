"use client";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef, } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo } from "react";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// Props with generic type T for rowData
type AgGridTableProps<T> = {
  columnDefs: ColDef[];
  rowData: T[];
  className?: string;
};

export default function AgGridTable<T>({
  columnDefs,
  rowData,
  className = "",
}: AgGridTableProps<T>) {
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  return (
    <div className={`ag-theme-alpine w-full h-[500px] ${className}`}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={20}
        domLayout="autoHeight"
        theme="legacy"
      />
    </div>
  );
}