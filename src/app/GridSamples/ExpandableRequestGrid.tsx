import React, { useMemo, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { LuChevronRight, LuChevronDown, LuEllipsisVertical } from "react-icons/lu";


/*
  =========================================================
  STEP 1: Custom cell renderer for the first column
  =========================================================
  This renders:
  - expand/collapse icon
  - request name
  - request id
  - options icon (three dots)

  It only shows this content for the "parent" row.
  For child/detail rows, it returns nothing.
*/
function RequestCellRenderer(props:any) {
  const { data } = props;

  // If this is not a parent row, do not render anything here
  if (data.rowType !== "parent") {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        width: "100%",
        paddingTop: "6px",
        paddingBottom: "6px",
      }}
    >
      {/* Expand / Collapse button */}
      <button
        onClick={() => data.onToggle(data.requestGroup)}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: 0,
          marginTop: "2px",
        }}
        aria-label={data.expanded ? "Collapse row" : "Expand row"}
      >
        {data.expanded ? <LuChevronDown size={16} /> : <LuChevronRight size={16} />}
      </button>

      {/* Main request text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            whiteSpace: "normal",
            lineHeight: "1.4",
          }}
        >
          {data.requestName}
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "4px",
          }}
        >
          Req ID: {data.requestId}
        </div>
      </div>

      {/* Three dots icon */}
      <button
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          padding: 0,
        }}
        aria-label="More options"
      >
        <LuEllipsisVertical size={16} />
      </button>
    </div>
  );
}

/*
  =========================================================
  STEP 2: Custom cell renderer for "PROCESS STAGE"
  =========================================================
  This also only appears for the parent row.
*/
function StageCellRenderer(props:any) {
  const { data } = props;

  if (data.rowType !== "parent") {
    return null;
  }

  return (
    <div
      style={{
        paddingTop: "6px",
        paddingBottom: "6px",
        whiteSpace: "normal",
        lineHeight: "1.4",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#6b7280",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        STEP {data.step}
      </div>

      <div style={{ fontWeight: 600 }}>{data.processStage}</div>
    </div>
  );
}

/*
  =========================================================
  STEP 3: Custom cell renderer for "ACTION REQUIRED"
  =========================================================
  Also shown only for parent rows.
*/
function ActionCellRenderer(props:any) {
  const { data, value } = props;

  if (data.rowType !== "parent") {
    return null;
  }

  return (
    <div
      style={{
        whiteSpace: "normal",
        lineHeight: "1.4",
        paddingTop: "6px",
        paddingBottom: "6px",
      }}
    >
      {value}
    </div>
  );
}

// status:
function StatusTagRenderer(props:any) {
  const { value } = props;

  let bg = "#FCE7F3";
  let color = "#000";

  if (value === "Approved") {
    bg = "#DCFCE7";
    color = "#000";
  } else if (value === "Pending") {
    bg = "#FEF3C7";
    color = "#000";
  }

  return (
    <div
      style={{
        display: "inline-block",
        padding: "0px 6px",
        backgroundColor: bg,
        color: color,
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 400,
        minWidth: "130px",
        textAlign: "center",
        marginTop: "6px",
      }}
    >
      {value}
    </div>
  );
}

/*
  =========================================================
  STEP 4: Main component
  =========================================================
*/
export default function ExpandableRequestGrid() {
  /*
    ---------------------------------------------------------
    STEP 4.1: Initial grouped data
    ---------------------------------------------------------
    Each parent row has:
    - request info
    - details array

    IMPORTANT:
    The details are NOT shown in the grid unless expanded = true
  */
 const isUserAdmin = !true; // Change to false to test non-admin view
  const [groups, setGroups] = useState([
    {
      requestGroup: "grp-1",
      requestName: "Establish Fraud Risk Indicators",
      requestId: "9377353",
      processStage: "Quality review",
      step: "2/3",
      actionRequired: "Review, edit and submit",
      expanded: false,
      details: [
        { fieldName: "Automation level", oldValue: "75%" , newValue: "80%" },
        { fieldName: "Users involved", oldValue: "20" , newValue: "80%" },
        { fieldName: "Manual tasks (%)", oldValue: "70%" , newValue: "80%" },
      ],
      status: "Pending",
    },
    {
      requestGroup: "grp-2",
      requestName: "Renewable Energy Transition Plan",
      requestId: "9377354",
      processStage: "Quality review",
      step: "2/3",
      actionRequired: "Review and approve",
      expanded: false,
      details: [
        { fieldName: "Priority", oldValue: "1%" , newValue: "80%" },
        { fieldName: "Owner", oldValue: "22%" , newValue: "80%" },
      ],
      status: "In Progress",
    },
    {
      requestGroup: "grp-3",
      requestName: "Urban Transportation Enhancement Project with a Longer Title to Test Wrapping",
      requestId: "9377355",
      processStage: "Quality review",
      step: "2/3",
      actionRequired: "New comment added",
      expanded: false,
      details: [
        { fieldName: "Description", oldValue: "14" , newValue: "33" },
        { fieldName: "Estimated budget", oldValue: "1.2M" , newValue: "2M%" },
      ],
      status: "Pending",
    },
  ]);

  /*
    ---------------------------------------------------------
    STEP 4.2: Toggle expand/collapse
    ---------------------------------------------------------
    When user clicks the arrow, switch expanded true/false
  */
  const toggleGroup = useCallback((groupId:any) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.requestGroup === groupId
          ? { ...group, expanded: !group.expanded }
          : group
      )
    );
  }, []);

  /*
    ---------------------------------------------------------
    STEP 4.3: Convert grouped data into AG Grid rows
    ---------------------------------------------------------
    AG Grid expects a flat array of rows.
    So we create:
    - 1 parent row always
    - child/detail rows only if expanded = true

    Parent row:
      shows request columns
      detail columns are empty

    Child rows:
      shows FIELD NAME and OLD VALUE
      parent columns are empty
  */
  const rowData = useMemo(() => {
    const rows:any = [];

    groups.forEach((group) => {
      // Parent row
      rows.push({
        id: `${group.requestGroup}-parent`,
        rowType: "parent",
        requestGroup: group.requestGroup,
        requestName: group.requestName,
        requestId: group.requestId,
        processStage: group.processStage,
        step: group.step,
        actionRequired: group.actionRequired,
        expanded: group.expanded,
        fieldName: "",
        oldValue: "",
        newValue: "",
        status: group.status,
        onToggle: toggleGroup,
      });

      // Child rows only if expanded
      if (group.expanded) {
        group.details.forEach((detail, index) => {
          rows.push({
            id: `${group.requestGroup}-detail-${index}`,
            rowType: "detail",
            requestGroup: group.requestGroup,
            requestName: "",
            requestId: "",
            processStage: "",
            step: "",
            actionRequired: "",
            expanded: false,
            fieldName: detail.fieldName,
            oldValue: detail.oldValue,
            newValue: detail.newValue,
          });
        });
      }
    });

    return rows;
  }, [groups, toggleGroup]);

  /*
    ---------------------------------------------------------
    STEP 4.4: Define the table columns
    ---------------------------------------------------------
    We set:
    - headerName = title shown in grid header
    - field = property name from rowData
    - cellRenderer for custom UI
    - wrapText + autoHeight for long text
  */
  const columnDefs:any = useMemo(() => {
    return [
      {
        headerName: "REQUEST NAME",
        field: "requestName",
        pinned: "left",
        minWidth: 500,
        cellRenderer: RequestCellRenderer,
        editable: false,
        wrapText: true,
        autoHeight: true,
        floatingFilter: false, // column search
      },
      {
        headerName: "REQUEST ID",
        field: "requestId",
        minWidth: 140,
        editable: isUserAdmin,
        filter: true,
        wrapText: true,
        autoHeight: true,
        floatingFilter: false, // column search
      },
      {
        headerName: "PROCESS STAGE",
        field: "processStage",
        minWidth: 220,
        cellRenderer: StageCellRenderer,
        editable: false,
        wrapText: true,
        autoHeight: true,
        floatingFilter: false, // column search
      },
      {
        headerName: "FIELD NAME",
        field: "fieldName",
        minWidth: 220,
        editable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        floatingFilter: false, // column search
      },
      {
        headerName: "OLD VALUE",
        field: "oldValue",
        minWidth: 180,
        editable: true,
        filter: true,
        wrapText: true,
        autoHeight: true,
        floatingFilter: false, // column search
      },
      {
        headerName: "NEW VALUE",
        field: "newValue",
        minWidth: 180,
        editable: false,
        filter: true,
        wrapText: true,
        autoHeight: true,
        floatingFilter: false, // column search
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusTagRenderer,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Pending", "In Progress", "Approved", "Rejected"],
        },
        minWidth: 180,
        floatingFilter: false, // column search
 
      },
      {
        headerName: "ACTION REQUIRED",
        field: "actionRequired",
        minWidth: 220,
        cellRenderer: ActionCellRenderer,
        editable: false,
        wrapText: true,
        autoHeight: true,
        floatingFilter: false, // column search
      },
    ];
  }, []);

  /*
    ---------------------------------------------------------
    STEP 4.5: Default settings for all columns
    ---------------------------------------------------------
  */
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
    };
  }, []);

  /*
    ---------------------------------------------------------
    STEP 4.6: Save edits made in detail rows
    ---------------------------------------------------------
    If user edits FIELD NAME or OLD VALUE in child rows,
    update the original groups state.
  */
  const handleCellValueChanged = useCallback((params:any) => {
    const { data } = params;

    // Only update detail rows
    if (data.rowType !== "detail") return;

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.requestGroup !== data.requestGroup) {
          return group;
        }

        const detailIndex = Number(data.id.split("-").pop());

        const updatedDetails = group.details.map((detail, index) => {
          if (index !== detailIndex) return detail;

          return {
            ...detail,
            fieldName: data.fieldName,
            oldValue: data.oldValue,
          };
        });

        return {
          ...group,
          details: updatedDetails,
        };
      })
    );
  }, []);

  /*
    ---------------------------------------------------------
    STEP 4.7: Optional row styling
    ---------------------------------------------------------
    Make child rows look slightly different
  */
  const getRowStyle = useCallback((params:any) => {
    if (params.data.rowType === "detail") {
      return {
        background: "#fafafa",
      };
    }

    return {
      background: "#ffffff",
    };
  }, []);

  /*
    ---------------------------------------------------------
    STEP 4.8: Render the AG Grid
    ---------------------------------------------------------
  */
  return (
    <div style={{ width: "100%" }}>
         <h1 className="text-2xl font-semibold text-foreground px-5">Expand grid</h1>
      <div
        className="ag-theme-alpine"
        style={{
          maxWidth: "100%",
          height: 650,
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
          onCellValueChanged={handleCellValueChanged}
          getRowStyle={getRowStyle}
          rowHeight={80}
          headerHeight={56}
          animateRows={true}
          suppressRowTransform={true}
        />
      </div>
    </div>
  );
}