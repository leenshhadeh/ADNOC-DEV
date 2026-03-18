import { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";


function ActionCellRenderer(params:any) {
  const handleClick = () => {
    alert(`Clicked row for: ${params.data.name}`);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: "100%",
      }}
    >
      <span>{params.value}</span>
      <button
        type="button"
        onClick={handleClick}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: "16px",
        }}
        title="Open"
      >
        🔗
      </button>
    </div>
  );
}


const BasicGrid=()=> {
  const [rowData, setRowData] = useState([
    {
      id: 1,
      name: "Leen",
      tasks: "Requirement gathering\nUI review",
      status: "In Progress",
      notes: "Waiting for client feedback",
      actionText: "View details",
    },
    {
      id: 2,
      name: "Mohammad",
      tasks: "API setup\nAxios config\nEnv variables",
      status: "Done",
      notes: "Backend connected",
      actionText: "Open task",
    },
    {
      id: 3,
      name: "Adil",
      tasks: "Planning\nEstimate\nDependencies",
      status: "Blocked",
      notes: "Need infrastructure input",
      actionText: "Check issue",
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      editable: true,
      resizable: true,
      floatingFilter: true,
      minWidth: 140,
      flex: 1,
    }),
    []
  );

  const columnDefs:any = useMemo(
    () =>
      [
        {
          headerName: "Name",
          field: "name",
          pinned: "left",
          lockPinned: false,
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Tasks",
          field: "tasks",
          filter: "agTextColumnFilter",
          autoHeight: true,
          cellStyle: {
            whiteSpace: "pre-line",
            lineHeight: "1.4",
          },
        },
        {
          headerName: "Status",
          field: "status",
          filter: "agTextColumnFilter",
          cellEditor: "agSelectCellEditor",
          cellEditorParams: {
            values: ["Not Started", "In Progress", "Blocked", "Done"],
          },
        },
        {
          headerName: "Notes",
          field: "notes",
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Action",
          field: "actionText",
          editable: false,
          sortable: false,
          filter: "agTextColumnFilter",
          cellRenderer: ActionCellRenderer,
        },
      ] ,
    []
  );

  const onCellValueChanged = (params:any) => {
    const updated = rowData.map((row) =>
      row.id === params.data.id ? params.data : row
    );
    setRowData(updated);
  };

  return (
    <div style={{ width: "100%" }}>
       <h1 className="text-2xl font-semibold text-foreground px-5">Basic grid</h1>
      <div
        className="ag-theme-alpine"
        style={{
            maxWidth: "100%",
            height: 350,
            borderRadius: "24px",
            overflow: "scroll",
            margin:"31px",
            border: "1px solid #e5e7eb",
          //   boxShadow: #D1D5DF80 50%
          boxShadow: "0 4px 12px rgba(209, 213, 223, 0.5)",
  
          }}
      >
      
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          stopEditingWhenCellsLoseFocus={true}
          onCellValueChanged={onCellValueChanged}
        />
      </div>
    </div>
  );
}
export default BasicGrid



