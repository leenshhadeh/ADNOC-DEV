import { useMemo ,useState} from "react";
import { AgGridReact } from "ag-grid-react";

export default function RowSpanning() {
    const [selectedColumn, setSelectedColumn] = useState("");
  
  const rowData = useMemo(() => {
    return [
      {
        domain: "domain 1",
        level1: "Exploration",
        level2: "region",
        level4: "task1",
      },
      {
        domain: "domain 1",
        level1: "Exploration",
        level2: "region",
        level4: "task2",
      },
      {
        domain: "domain 1",
        level1: "Exploration",
        level2: "region 2",
        level4: "task2",
      },
      {
        domain: "domain 1",
        level1: "Exploration 2",
        level2: "play",
        level4: "task1",
      },
      {
        domain: "domain 2",
        level1: "Field Development Planning",
        level2: "region",
        level4: "task1",
      },
    ];
  }, []);

  const columnDefs: any = useMemo(() => {
    return [
      {
        headerName: "Domain",
        field: "domain",
        spanRows: true,
        width: 450,
      },
      {
        headerName: "Level 1",
        field: "level1",
        spanRows: true,
        width: 350,
        checkboxSelection: true,

        // ✅ optional: select all from header
        headerCheckboxSelection: true,
      
        // optional: only show checkbox for first column
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: "Level 2",
        field: "level2",
        spanRows: true,
        checkboxSelection: true,

        // ✅ optional: select all from header
        headerCheckboxSelection: true,
      
        // optional: only show checkbox for first column
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        headerName: "Level 3",
        field: "level4",
      },
    ];
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      sortable: false,
      filter: false,
      resizable: true,
      minWidth: 140,
      cellStyle: {
        display: "flex",
        alignItems: "start",
      },
    };
  }, []);

  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground px-5">Spanning grid</h1>



    <div
      className="ag-theme-alpine"
      style={{
        maxWidth: "100%",
        height: 350,
        borderRadius: "24px",
        overflow: "scroll",
        margin: "31px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(209, 213, 223, 0.5)",
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        enableCellSpan={true}
        rowHeight={56}
         rowSelection="multiple"
      />
    </div>
    </>
  );
}
