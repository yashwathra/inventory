"use client";

import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo } from 'react';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

type AgGridTableProps = {
  columnDefs: any[];
  rowData: any[];
  className?: string;
};

export default function AgGridTable({ columnDefs, rowData, className }: AgGridTableProps) {
  const defaultColDef = useMemo(() => ({
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