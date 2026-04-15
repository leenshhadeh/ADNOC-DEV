# Process Catalog — API Contract

> **Version:** 1.2 &nbsp;|&nbsp; **Date:** 2026-04-13 &nbsp;|&nbsp; **Frontend Team**
>
> JSON contracts the frontend expects from the .NET backend for the **Process Catalog** module. All endpoints return the **ApiResponse** envelope.

---

## Table of Contents

1. [Response Envelope](#1-response-envelope)
2. [Authentication](#2-authentication)
3. [Endpoints](#3-endpoints)
   - 3.1 [GET /api/process-catalog/rows](#31-get-apiprocess-catalogrows)
   - 3.2 [GET /api/domains](#32-get-apidomains)
   - 3.3 [GET /api/group-companies](#33-get-apigroup-companies)
   - 3.4 [GET /api/processes/:parentId/level4s](#34-get-apiprocessesparentidlevel4s)
   - 3.5 [GET /api/process-catalog/my-tasks](#35-get-apiprocess-catalogmy-tasks)
   - 3.6 [GET /api/process-catalog/submitted-requests](#36-get-apiprocess-catalogsubmitted-requests)
   - 3.7 [GET /api/process-catalog/recorded-changes/:processId](#37-get-apiprocess-catalogrecorded-changesprocessid)
   - 3.8 [POST /api/process-catalog](#38-post-apiprocess-catalog)
   - 3.9 [PATCH /api/process-catalog/:id/rename](#39-patch-apiprocess-catalogidrename)
   - 3.10 [PATCH /api/process-catalog/entities](#310-patch-apiprocess-catalogentities)
   - 3.11 [POST /api/processes/:parentId/level4s](#311-post-apiprocessesparentidlevel4s)
   - 3.12 [PUT /api/level4/:id](#312-put-apilevel4id)
   - 3.13 [POST /api/process-catalog/:id/validate](#313-post-apiprocess-catalogidvalidate)
   - 3.14 [PUT /api/processes/:parentId/level4s](#314-put-apiprocessesparentidlevel4s)
   - 3.15 [DELETE /api/level4s/:id](#315-delete-apilevel4sid)
   - 3.16 [GET /api/processes/:parentId/level4-names](#316-get-apiprocessesparentidlevel4-names)
   - 3.17 [PUT /api/processes/bulk-edit](#317-put-apiprocessesbulk-edit)
   - 3.18 [POST /api/processes/bulk-submit](#318-post-apiprocessesbulk-submit)
   - 3.19 [POST /api/tasks/:taskId/approve](#319-post-apitaskstaskidapprove)
   - 3.20 [POST /api/tasks/:taskId/return](#320-post-apitaskstaskidreturn)
   - 3.21 [POST /api/tasks/:taskId/reject](#321-post-apitaskstaskidreject)
   - 3.22 [POST /api/tasks/bulk-approve](#322-post-apitasksbulk-approve)
   - 3.23 [POST /api/tasks/bulk-return](#323-post-apitasksbulk-return)
   - 3.24 [POST /api/tasks/bulk-reject](#324-post-apitasksbulk-reject)
4. [Enums & Shared Types](#4-enums--shared-types)
5. [Error Handling](#5-error-handling)

---

## 1. Response Envelope

Every endpoint **must** wrap its payload in this envelope:

```json
{
  "data": "<T>",
  "message": "string",
  "success": true,
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 230
  }
}
```

| Field        | Type             | Required | Notes                                             |
| ------------ | ---------------- | -------- | ------------------------------------------------- |
| `data`       | `T`              | ✅       | The payload — type depends on the endpoint        |
| `message`    | `string`         | ✅       | Human-readable message (e.g. `"OK"`, `"Created"`) |
| `success`    | `boolean`        | ✅       | `true` for 2xx responses                          |
| `pagination` | `object \| null` | ❌       | Only include on paginated list endpoints          |

---

## 2. Authentication

All requests include an `Authorization` header:

```
Authorization: Bearer <JWT>
```

On **401 Unauthorized**, the frontend clears the token and redirects to `/login`.

---

## 3. Endpoints

### 3.1 GET `/api/process-catalog/rows`

Returns the full process hierarchy (Domain → Level 1 → Level 2 → Level 3) flattened into rows. Each row represents a unique Level 3 process.

**Response — `data: ProcessItem[]`**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "domain": "dom-005",
      "level1Name": "Sub-surface",
      "level1Code": "EXP.1",
      "level2Name": "G&G Studies",
      "level2Code": "EXP.1.1",
      "level3Name": "Basin Modeling",
      "level3Code": "EXP.1.1.1",
      "level3Status": "Published",
      "description": "Defines the structural framework of the basin...",
      "isSharedService": false,
      "entities": {
        "gc-001": {
          "General": "Yes",
          "Site B": "No"
        },
        "gc-002": {
          "General": "Yes"
        }
      }
    }
  ],
  "message": "OK",
  "success": true
}
```

**`ProcessItem` field reference:**

| Field             | Type                                    | Required | Description                                                                                                                                                                 |
| ----------------- | --------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | `string` (UUID)                         | ✅       | Unique identifier for the Level 3 row                                                                                                                                       |
| `domain`          | `string`                                | ✅       | Domain ID from `/api/domains` (e.g. `"dom-005"`). Use `Domain.name` only for display.                                                                                       |
| `level1Name`      | `string`                                | ✅       | Level 1 process name                                                                                                                                                        |
| `level1Code`      | `string`                                | ✅       | Level 1 code (e.g. `"EXP.1"`)                                                                                                                                               |
| `level2Name`      | `string`                                | ✅       | Level 2 process name                                                                                                                                                        |
| `level2Code`      | `string`                                | ✅       | Level 2 code (e.g. `"EXP.1.1"`)                                                                                                                                             |
| `level3Name`      | `string`                                | ✅       | Level 3 process name                                                                                                                                                        |
| `level3Code`      | `string`                                | ✅       | Level 3 code (e.g. `"EXP.1.1.1"`)                                                                                                                                           |
| `level3Status`    | `ProcessStatus`                         | ✅       | See [Enums](#4-enums--shared-types)                                                                                                                                         |
| `description`     | `string`                                | ✅       | Free-text description (can be empty `""`)                                                                                                                                   |
| `isSharedService` | `boolean`                               | ✅       | Whether this process is a shared service                                                                                                                                    |
| `entities`        | `Record<string, Record<string, YesNo>>` | ✅       | Nested map: **Group Company ID → Site name → `"Yes"` \| `"No"`**. Outer keys are `GroupCompany.id` values from `/api/group-companies`; inner keys remain site name strings. |

> **Important:** The `entities` object is keyed by company **ID** (not name). Use `GroupCompany.id` as the outer key and `GroupCompany.name` only for display. Inner site keys remain name strings. Switching to ID-based keys ensures rename safety.

---

### 3.2 GET `/api/domains`

Returns the list of business domains. Used as a lookup to resolve `ProcessItem.domain` IDs to display names.

**Response — `data: Domain[]`**

```json
{
  "data": [
    {
      "id": "dom-005",
      "name": "Exploration & Planning",
      "code": "EXP"
    },
    {
      "id": "dom-006",
      "name": "Finance",
      "code": "FIN"
    }
  ],
  "message": "OK",
  "success": true
}
```

| Field  | Type     | Required | Description                                                   |
| ------ | -------- | -------- | ------------------------------------------------------------- |
| `id`   | `string` | ✅       | Unique domain identifier (used as FK in `ProcessItem.domain`) |
| `name` | `string` | ✅       | Display name (e.g. `"Exploration & Planning"`)                |
| `code` | `string` | ✅       | Short code used for level codes (e.g. `"EXP"`)                |

---

### 3.3 GET `/api/group-companies`

Returns the group companies the authenticated user is authorised to see.

**Response — `data: GroupCompany[]`**

```json
{
  "data": [
    {
      "id": "gc-001",
      "name": "ADNOC HQ",
      "sites": [
        { "id": "s-001", "name": "General" },
        { "id": "s-002", "name": "Site B" },
        { "id": "s-003", "name": "Site C" }
      ]
    }
  ],
  "message": "OK",
  "success": true
}
```

| Field          | Type     | Required | Description                    |
| -------------- | -------- | -------- | ------------------------------ |
| `id`           | `string` | ✅       | Unique company identifier      |
| `name`         | `string` | ✅       | Display name (used as map key) |
| `sites`        | `Site[]` | ✅       | List of sites                  |
| `sites[].id`   | `string` | ✅       | Unique site identifier (GUID)  |
| `sites[].name` | `string` | ✅       | Site display name              |

---

### 3.4 GET `/api/processes/:parentId/level4s`

Returns Level 4 records under a given Level 3 process.

**Path params:** `parentId` — UUID of the parent Level 3 row.

**Response — `data: Level4Item[]`**

```json
{
  "data": [
    {
      "id": "l4-001",
      "processCode": "EXP.1.1.1.1",
      "name": "Define basin framework",
      "description": "Defines the structural framework...",
      "status": "Published",
      "parentId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "message": "OK",
  "success": true
}
```

| Field         | Type            | Required | Description                                |
| ------------- | --------------- | -------- | ------------------------------------------ |
| `id`          | `string` (UUID) | ✅       | Unique Level 4 identifier                  |
| `processCode` | `string`        | ✅       | Auto-generated code (e.g. `"EXP.1.1.1.1"`) |
| `name`        | `string`        | ✅       | Level 4 process name                       |
| `description` | `string`        | ✅       | Free-text description                      |
| `status`      | `ProcessStatus` | ✅       | Current status                             |
| `parentId`    | `string` (UUID) | ✅       | FK to parent Level 3                       |

---

### 3.5 GET `/api/process-catalog/my-tasks`

Returns tasks assigned to the current user that need action.

**Response — `data: TaskItem[]`**

```json
{
  "data": [
    {
      "id": "task-001",
      "processId": "550e8400-...",
      "processName": "Basin Modeling",
      "requestId": "REQ-001",
      "level": "L3",
      "domain": "dom-005",
      "stageCurrent": 2,
      "stageTotal": 4,
      "stageText": "Quality Review",
      "requester": "John Doe",
      "status": "Quality Review",
      "returnComment": null,
      "returnedBy": null,
      "actionRequired": "Review and approve",
      "submittedOn": "22 Apr 2025",
      "changes": [
        {
          "name": "Process Name",
          "changeType": "Update",
          "oldValue": "Basin Modeling v1",
          "newValue": "Basin Modeling"
        }
      ]
    }
  ],
  "message": "OK",
  "success": true
}
```

| Field            | Type             | Required | Description                                |
| ---------------- | ---------------- | -------- | ------------------------------------------ |
| `id`             | `string`         | ✅       | Task identifier                            |
| `processId`      | `string` (UUID)  | ❌       | FK for deep-link navigation to catalog row |
| `processName`    | `string`         | ✅       | Display name                               |
| `requestId`      | `string`         | ✅       | Associated change request ID               |
| `level`          | `string`         | ✅       | e.g. `"L3"`, `"L4"`                        |
| `domain`         | `string`         | ✅       | Domain ID from `/api/domains`              |
| `stageCurrent`   | `number`         | ✅       | Current workflow stage (1-based)           |
| `stageTotal`     | `number`         | ✅       | Total workflow stages                      |
| `stageText`      | `string`         | ✅       | Label for current stage                    |
| `requester`      | `string`         | ✅       | Name of person who submitted               |
| `status`         | `ProcessStatus`  | ✅       | Current status                             |
| `returnComment`  | `string \| null` | ❌       | Populated when status is `"Returned"`      |
| `returnedBy`     | `string \| null` | ❌       | Who returned it                            |
| `actionRequired` | `string \| null` | ❌       | What the user needs to do                  |
| `submittedOn`    | `string \| null` | ❌       | Submission date                            |
| `changes`        | `ChangeRecord[]` | ❌       | List of field-level changes (see below)    |

**`ChangeRecord`:**

| Field        | Type     | Description              |
| ------------ | -------- | ------------------------ |
| `name`       | `string` | Field that changed       |
| `changeType` | `string` | `"Update"` or `"Create"` |
| `oldValue`   | `string` | Previous value           |
| `newValue`   | `string` | New value                |

---

### 3.6 GET `/api/process-catalog/submitted-requests`

Returns change requests submitted by (or visible to) the current user.

**Response — `data: RequestItem[]`**

```json
{
  "data": [
    {
      "id": "req-001",
      "processId": "550e8400-...",
      "processName": "Basin Modeling",
      "requestId": "REQ-001",
      "level": "L3",
      "requester": "John Doe",
      "approver": "Jane Smith",
      "status": "Pending approval",
      "stageCurrent": 2,
      "stageTotal": 4,
      "stageText": "Quality Review",
      "submittedOn": "22 Apr 2025",
      "publishedOn": "",
      "changes": [{ "id": "ch-1", "label": "Process Name", "oldValue": "v1", "newValue": "v2" }],
      "processCategory": "Exploration",
      "domain": "dom-005",
      "processLevel": "L3",
      "level1": "Sub-surface",
      "level2": "G&G Studies",
      "businessFocalPoint": "Jane Smith",
      "workflowHistory": [
        {
          "id": "wh-1",
          "action": "Submitted",
          "date": "22 Apr 2025 at 10:14 AM",
          "userName": "John Doe",
          "userRole": "Process Owner",
          "reason": null
        }
      ]
    }
  ],
  "message": "OK",
  "success": true
}
```

| Field                | Type                    | Required | Description                           |
| -------------------- | ----------------------- | -------- | ------------------------------------- |
| `id`                 | `string`                | ✅       | Request identifier                    |
| `processId`          | `string` (UUID)         | ❌       | FK for deep-link navigation           |
| `processName`        | `string`                | ✅       | Display name                          |
| `requestId`          | `string`                | ✅       | Human-readable request ID             |
| `level`              | `string`                | ✅       | e.g. `"L3"`                           |
| `requester`          | `string`                | ✅       | Who submitted                         |
| `approver`           | `string`                | ✅       | Assigned approver                     |
| `status`             | `ProcessStatus`         | ✅       | Current status                        |
| `stageCurrent`       | `number`                | ✅       | Current workflow stage                |
| `stageTotal`         | `number`                | ✅       | Total stages                          |
| `stageText`          | `string`                | ✅       | Stage label                           |
| `submittedOn`        | `string`                | ✅       | Submission date                       |
| `publishedOn`        | `string`                | ✅       | Publish date (empty if not published) |
| `changes`            | `ChangeDetail[]`        | ✅       | Field-level changes                   |
| `processCategory`    | `string`                | ❌       | Badge label for detail view           |
| `domain`             | `string`                | ❌       | Domain ID from `/api/domains`         |
| `processLevel`       | `string`                | ❌       | Level label                           |
| `level1`             | `string`                | ❌       | Level 1 name                          |
| `level2`             | `string`                | ❌       | Level 2 name                          |
| `businessFocalPoint` | `string`                | ❌       | Falls back to `approver`              |
| `workflowHistory`    | `WorkflowHistoryItem[]` | ❌       | Timeline of actions                   |

**`ChangeDetail`:**

| Field      | Type     | Description    |
| ---------- | -------- | -------------- |
| `id`       | `string` | Change ID      |
| `label`    | `string` | Field name     |
| `oldValue` | `string` | Previous value |
| `newValue` | `string` | New value      |

**`WorkflowHistoryItem`:**

| Field      | Type             | Description                        |
| ---------- | ---------------- | ---------------------------------- |
| `id`       | `string`         | Entry ID                           |
| `action`   | `string`         | e.g. `"Submitted"`, `"Returned"`   |
| `date`     | `string`         | e.g. `"22 Apr 2025 at 10:14 AM"`   |
| `userName` | `string`         | Who performed the action           |
| `userRole` | `string`         | Role at the time                   |
| `reason`   | `string \| null` | Populated for `"Returned"` actions |

---

### 3.7 GET `/api/process-catalog/recorded-changes/:processId`

Returns the change log for a specific Level 3 process — grouped by parent, current, and child levels.

**Path params:** `processId` — UUID of the Level 3 row.

**Response — `data: ChangeLogEntry[]`**

```json
{
  "data": [
    {
      "id": "c1",
      "processName": "Sub-surface",
      "levelLabel": "L 1",
      "levelNum": 1,
      "changeType": "Update",
      "changedItem": "Process Name",
      "groupCompany": "-",
      "oldValue": "Sub-surface",
      "newValue": "Exploration",
      "modifiedBy": "Dania Al Farsi",
      "modifiedOn": "04 Apr 2024, 3:33PM",
      "section": "parent"
    }
  ],
  "message": "OK",
  "success": true
}
```

| Field          | Type     | Required | Description                                    |
| -------------- | -------- | -------- | ---------------------------------------------- |
| `id`           | `string` | ✅       | Entry identifier                               |
| `processName`  | `string` | ✅       | Name of the changed process                    |
| `levelLabel`   | `string` | ✅       | e.g. `"L 1"`, `"L 3"`, `"L 4"`                 |
| `levelNum`     | `number` | ✅       | Numeric level (1–4)                            |
| `changeType`   | `string` | ✅       | `"Update"` or `"Create"`                       |
| `changedItem`  | `string` | ✅       | What field was changed (e.g. `"Process Name"`) |
| `groupCompany` | `string` | ✅       | Affected company or `"-"` if N/A               |
| `oldValue`     | `string` | ✅       | Previous value                                 |
| `newValue`     | `string` | ✅       | New value                                      |
| `modifiedBy`   | `string` | ✅       | Who made the change                            |
| `modifiedOn`   | `string` | ✅       | When (e.g. `"04 Apr 2024, 3:33PM"`)            |
| `section`      | `string` | ✅       | `"parent"` \| `"this"` \| `"child"`            |

---

### 3.8 POST `/api/process-catalog`

Creates a new process row (Level 1, 2, or 3 depending on payload).

**Request body:**

```json
{
  "domain": "dom-005",
  "level1Name": "Sub-surface",
  "level1Code": "EXP.1",
  "level2Name": "G&G Studies",
  "level2Code": "EXP.1.1",
  "level3Name": "New Process",
  "level3Code": "EXP.1.1.4",
  "description": "",
  "isSharedService": false,
  "entities": {}
}
```

**Response — `data: ProcessItem`** (the created row)

Returns `201 Created`.

---

### 3.9 PATCH `/api/process-catalog/:id/rename`

Renames a process at any level.

**Path params:** `id` — UUID of the process.

**Request body:**

```json
{
  "name": "Updated Process Name"
}
```

**Response — `data: null`**

Returns `200 OK` with `"message": "Renamed"`.

---

### 3.10 PATCH `/api/process-catalog/entities`

Bulk update entity applicability (the Yes/No toggles in the table).

**Request body:**

```json
{
  "updates": [
    {
      "processId": "550e8400-...",
      "company": "gc-001",
      "site": "General",
      "value": "Yes"
    }
  ]
}
```

| Field       | Type     | Required | Description                          |
| ----------- | -------- | -------- | ------------------------------------ |
| `processId` | `string` | ✅       | Target Level 3 row                   |
| `company`   | `string` | ✅       | Group company ID (`GroupCompany.id`) |
| `site`      | `string` | ✅       | Site name                            |
| `value`     | `YesNo`  | ✅       | `"Yes"` or `"No"`                    |

**Response — `data: null`**

Returns `200 OK`.

---

### 3.11 POST `/api/processes/:parentId/level4s`

Creates one or more Level 4 records under a Level 3 parent.

**Path params:** `parentId` — UUID of the parent Level 3.

**Request body:**

```json
{
  "companySites": [
    {
      "groupCompanyId": "gc-001",
      "siteId": "s-001"
    },
    {
      "groupCompanyId": "gc-001",
      "siteId": "s-002"
    }
  ],
  "items": [
    {
      "processName": "New L4 Process",
      "processDescription": ""
    }
  ]
}
```

| Field                           | Type               | Required | Description                    |
| ------------------------------- | ------------------ | -------- | ------------------------------ |
| `companySites`                  | `CompanySiteRef[]` | ✅       | Array of company/site ID pairs |
| `companySites[].groupCompanyId` | `string`           | ✅       | Group company ID (GUID)        |
| `companySites[].siteId`         | `string`           | ✅       | Site ID (GUID)                 |
| `items[].processName`           | `string`           | ✅       | L4 process name                |
| `items[].processDescription`    | `string`           | ❌       | Free-text description          |

**Response — `data: Level4Item[]`** (the created records)

Returns `201 Created`.

> **Note:** `processCode` is auto-generated by the backend based on the hierarchy position.

---

### 3.12 PUT `/api/level4/:id`

Updates an existing Level 4 record.

**Path params:** `id` — UUID of the Level 4 record.

**Request body:**

```json
{
  "processName": "Updated Name",
  "processDescription": "Updated description"
}
```

**Response — `data: Level4Item`** (the updated record)

Returns `200 OK`.

---

### 3.13 POST `/api/process-catalog/:id/validate`

Triggers validation / submission for approval on a Level 3 process.

**Path params:** `id` — UUID of the Level 3 row.

**Request body:** _(empty or optional metadata)_

```json
{}
```

**Response — `data: null`**

Returns `200 OK` with `"message": "Submitted for validation"`.

---

### 3.14 PUT `/api/processes/:parentId/level4s`

Bulk save (create, update, or delete) Level 4 records under a Level 3 parent. Used when editing the L4 table inline and clicking "Save".

**Path params:** `parentId` — UUID of the parent Level 3 row.

**Request body:**

```json
{
  "rows": [
    {
      "processName": "Updated L4 Name",
      "processDescription": "Updated description",
      "status": "Draft"
    },
    {
      "processName": "New L4",
      "processDescription": ""
    }
  ]
}
```

| Field                | Type            | Required | Description                      |
| -------------------- | --------------- | -------- | -------------------------------- |
| `processName`        | `string`        | ✅       | L4 name                          |
| `processDescription` | `string`        | ❌       | Free-text description            |
| `status`             | `ProcessStatus` | ❌       | Defaults to `"Draft"` if omitted |

> **Note:** `processCode` is auto-generated by the backend based on the hierarchy position.

**Response — `data: SaveLevel4sResponse`**

```json
{
  "data": {
    "updated": 1,
    "created": 1,
    "deleted": 0
  },
  "message": "OK",
  "success": true
}
```

| Field     | Type     | Description                |
| --------- | -------- | -------------------------- |
| `updated` | `number` | Number of rows updated     |
| `created` | `number` | Number of new rows created |
| `deleted` | `number` | Number of rows deleted     |

Returns `200 OK`.

---

### 3.15 DELETE `/api/level4s/:id`

Deletes a single Level 4 record.

**Path params:** `id` — UUID of the Level 4 record.

**Request body:** _(none)_

**Response — `data: DeleteLevel4Response`**

```json
{
  "data": {
    "id": "l4-001"
  },
  "message": "Deleted",
  "success": true
}
```

| Field | Type     | Description                   |
| ----- | -------- | ----------------------------- |
| `id`  | `string` | ID of the deleted Level 4 row |

Returns `200 OK`.

---

### 3.16 GET `/api/processes/:parentId/level4-names`

Returns a flat list of Level 4 process names under a Level 3 parent. Used for autocomplete / validation without fetching full L4 records.

**Path params:** `parentId` — UUID of the parent Level 3 row.

**Response — `data: string[]`**

```json
{
  "data": ["Define basin framework", "Seismic interpretation", "Well correlation"],
  "message": "OK",
  "success": true
}
```

Returns `200 OK`.

---

### 3.17 PUT `/api/processes/bulk-edit`

Bulk-edit applicability for multiple Level 3 processes at once. Typically used when toggling a company/site column for many rows simultaneously.

**Request body:**

```json
{
  "processIds": ["550e8400-e29b-41d4-a716-446655440000", "660f9500-f39c-52e5-b827-557766551111"],
  "companySite": "gc-001: General"
}
```

| Field         | Type       | Required | Description                                                |
| ------------- | ---------- | -------- | ---------------------------------------------------------- |
| `processIds`  | `string[]` | ✅       | UUIDs of the Level 3 rows to edit                          |
| `companySite` | `string`   | ✅       | `"CompanyId: Site"` key to toggle (uses `GroupCompany.id`) |

**Response — `data: BulkProcessActionResponse`**

```json
{
  "data": {
    "processed": 2,
    "failed": 0
  },
  "message": "OK",
  "success": true
}
```

| Field       | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `processed` | `number` | Number of rows successfully edited |
| `failed`    | `number` | Number of rows that failed         |

Returns `200 OK`.

---

### 3.18 POST `/api/processes/bulk-submit`

Submits multiple Level 3 processes for approval in a single request.

**Request body:**

```json
{
  "processIds": ["550e8400-e29b-41d4-a716-446655440000", "660f9500-f39c-52e5-b827-557766551111"]
}
```

| Field        | Type       | Required | Description                         |
| ------------ | ---------- | -------- | ----------------------------------- |
| `processIds` | `string[]` | ✅       | UUIDs of the Level 3 rows to submit |

**Response — `data: BulkProcessActionResponse`**

```json
{
  "data": {
    "processed": 2,
    "failed": 0
  },
  "message": "OK",
  "success": true
}
```

Returns `200 OK`.

---

### 3.19 POST `/api/tasks/:taskId/approve`

Approves a single task assigned to the current user.

**Path params:** `taskId` — ID of the task.

**Request body:** _(none)_

**Response — `data: TaskActionResponse`**

```json
{
  "data": {
    "taskId": "task-001",
    "status": "approved",
    "message": "Task approved successfully"
  },
  "message": "OK",
  "success": true
}
```

| Field     | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `taskId`  | `string` | The task that was acted on                   |
| `status`  | `string` | `"approved"` \| `"returned"` \| `"rejected"` |
| `message` | `string` | Human-readable confirmation                  |

Returns `200 OK`.

---

### 3.20 POST `/api/tasks/:taskId/return`

Returns a task to the requester with a reason.

**Path params:** `taskId` — ID of the task.

**Request body:**

```json
{
  "reason": "Missing description for the process"
}
```

| Field    | Type     | Required | Description                |
| -------- | -------- | -------- | -------------------------- |
| `reason` | `string` | ✅       | Explanation for the return |

**Response — `data: TaskActionResponse`**

```json
{
  "data": {
    "taskId": "task-001",
    "status": "returned",
    "message": "Task returned successfully"
  },
  "message": "OK",
  "success": true
}
```

Returns `200 OK`.

---

### 3.21 POST `/api/tasks/:taskId/reject`

Rejects a task permanently.

**Path params:** `taskId` — ID of the task.

**Request body:**

```json
{
  "reason": "Duplicate process entry"
}
```

| Field    | Type     | Required | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| `reason` | `string` | ✅       | Explanation for the rejection |

**Response — `data: TaskActionResponse`**

```json
{
  "data": {
    "taskId": "task-001",
    "status": "rejected",
    "message": "Task rejected successfully"
  },
  "message": "OK",
  "success": true
}
```

Returns `200 OK`.

---

### 3.22 POST `/api/tasks/bulk-approve`

Approves multiple tasks in a single request.

**Request body:**

```json
{
  "taskIds": ["task-001", "task-002", "task-003"]
}
```

| Field     | Type       | Required | Description                 |
| --------- | ---------- | -------- | --------------------------- |
| `taskIds` | `string[]` | ✅       | IDs of the tasks to approve |

**Response — `data: BulkActionResponse`**

```json
{
  "data": {
    "processed": 3,
    "failed": 0
  },
  "message": "OK",
  "success": true
}
```

| Field       | Type     | Description                           |
| ----------- | -------- | ------------------------------------- |
| `processed` | `number` | Number of tasks successfully acted on |
| `failed`    | `number` | Number of tasks that failed           |

Returns `200 OK`.

---

### 3.23 POST `/api/tasks/bulk-return`

Returns multiple tasks to their requesters with a shared reason.

**Request body:**

```json
{
  "taskIds": ["task-001", "task-002"],
  "reason": "Incomplete process descriptions"
}
```

| Field     | Type       | Required | Description                |
| --------- | ---------- | -------- | -------------------------- |
| `taskIds` | `string[]` | ✅       | IDs of the tasks to return |
| `reason`  | `string`   | ✅       | Shared reason for return   |

**Response — `data: BulkActionResponse`**

Same shape as [3.21](#321-post-apitasksbulk-approve).

Returns `200 OK`.

---

### 3.24 POST `/api/tasks/bulk-reject`

Rejects multiple tasks with an optional shared reason.

**Request body:**

```json
{
  "taskIds": ["task-001", "task-002"],
  "reason": "Duplicate entries"
}
```

| Field     | Type       | Required | Description                      |
| --------- | ---------- | -------- | -------------------------------- |
| `taskIds` | `string[]` | ✅       | IDs of the tasks to reject       |
| `reason`  | `string`   | ❌       | Optional shared rejection reason |

**Response — `data: BulkActionResponse`**

Same shape as [3.21](#321-post-apitasksbulk-approve).

Returns `200 OK`.

---

## 4. Enums & Shared Types

### `ProcessStatus`

```
"Published" | "Pending approval" | "Draft" | "Ready for Submission" |
"Quality Review" | "Digital VP Review" | "Returned" | "Rejected"
```

### `YesNo`

```
"Yes" | "No"
```

---

## 5. Error Handling

All error responses use this shape:

```json
{
  "data": null,
  "message": "Detailed error description",
  "success": false
}
```
