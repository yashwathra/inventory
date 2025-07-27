"use client";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useMemo } from "react";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

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
    <div className={`flex flex-col h-[600px] w-full ${className}`}>
      
      {/* Scrollable AG Grid container */}
      <div className="ag-theme-alpine flex-1 overflow-y-auto">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={20}
          domLayout="normal"
          theme="legacy"
        />
      </div>

      
    </div>
  );
}
