import React, { useRef, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";



export default function GridWithBulkEdit() {
  const gridRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [value, setValue] = useState("");
  const [rowData, setRowData] = useState([
    { id: 1, name: "Task 1", status: "Pending", region: "EU" },
    { id: 2, name: "Task 2", status: "Approved", region: "US" },
    { id: 3, name: "Task 3", status: "Pending", region: "ME" },
  ]);

  const columnDefs = useMemo(
    () => [
  
      { field: "name", editable: true ,

          // ✅ add checkbox here
  checkboxSelection: true,

  // ✅ optional: select all from header
  headerCheckboxSelection: true,

  // optional: only show checkbox for first column
  headerCheckboxSelectionFilteredOnly: true,
      },
      {
        field: "status",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Pending", "Approved", "Rejected"],
        },
      },
      { field: "region", editable: true },
    ],
    []
  );

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // ✅ Get editable columns dynamically
  const getEditableColumns = () => {
    if (!gridRef.current?.api) return [];

    return gridRef.current.api
      .getAllGridColumns()
      .map((col) => col.getColDef())
      .filter((col) => col.editable)
      .map((col) => col.field);
  };

  // ✅ Apply bulk edit (ALL rows)
  const applyToAll = () => {
    if (!selectedColumn) return;
  
    setRowData((prev) =>
      prev.map((row) => ({
        ...row,
        [selectedColumn]: value,
      }))
    );
  
    resetModal();
  };

  // ✅ Apply bulk edit (ONLY selected rows)
  const applyToSelected = () => {
    if (!selectedColumn) return;
  
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedIds = selectedNodes.map((node) => node.data.id);
  
    setRowData((prev) =>
      prev.map((row) =>
        selectedIds.includes(row.id)
          ? { ...row, [selectedColumn]: value }
          : row
      )
    );
  
    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setSelectedColumn("");
    setValue("");
  };

  return (
    <div style={{ padding: 20 }}>
      {/* 🔘 Button */}
      <button onClick={() => setShowModal(true)}>
        Bulk Edit
      </button>

      {/* 🧾 AG Grid */}
      <div
        className="ag-theme-alpine"
        style={{ height: 400, width: "100%", marginTop: 20 }}
      >
       <AgGridReact
  ref={gridRef}
  rowData={rowData}
  columnDefs={columnDefs}
  defaultColDef={defaultColDef}
  rowSelection="multiple"
  stopEditingWhenCellsLoseFocus={true}
/>
      </div>

      {/* 🪟 Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Bulk Edit</h3>

            {/* Column Select */}
            <div style={{ marginBottom: 10 }}>
              <label>Column</label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                style={styles.input}
              >
                <option value="">Select column</option>
                {getEditableColumns().map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Input */}
            <div style={{ marginBottom: 10 }}>
              <label>Value</label>

              {selectedColumn === "status" ? (
                <select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  style={styles.input}
                >
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              ) : (
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                  style={styles.input}
                />
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={applyToAll}>Apply to All</button>
              <button onClick={applyToSelected}>Apply to Selected</button>
              <button onClick={resetModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🧱 Simple CSS (no library) */
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    width: 300,
  },
  input: {
    width: "100%",
    padding: "6px",
    marginTop: "5px",
  },
};