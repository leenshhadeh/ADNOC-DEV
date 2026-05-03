# Assesssment Data — API Contract

> **Version:** 1.1 &nbsp;|&nbsp; **Date:** 2026-04-09 &nbsp;|&nbsp; **Frontend Team**
>
> JSON contracts the frontend expects from the .NET backend for the **Assesssment Data** module. All endpoints return the **ApiResponse** envelope.

---

## Table of Contents

1. [Response Envelope](#1-response-envelope)
2. [Authentication](#2-authentication)
3. [Endpoints](#3-endpoints)
   - 3.1 [GET /api/process-Assesssment/rows](#31-get-apiprocess-Assesssmentrows)
   - 3.2 [GET /api/process-Assesssment/my-tasks](#32-get-apiprocess-Assesssmentmy-tasks)
   - 3.3 [GET /api/process-Assesssment/submitted-requests](#33-get-apiprocess-Assesssmentsubmitted-requests)
   - 3.4 [GET /api/process-Assesssment/process/:processId](#34-get-processDetails)
   - 3.5 [POST /api/process-Assesssment/rows/save-draft](#35-post-apiprocess-assesssmentrowssave-draft)
   - 3.6 [POST /api/process-Assesssment/process/:processId/submit](#36-post-apiprocess-assesssmentprocessprocessidsubmit)
   - 3.7 [POST /api/process-Assesssment/process/:processId/switch-to-draft](#37-post-apiprocess-assesssmentprocessprocessidswitch-to-draft)
   - 3.8 [POST /api/process-Assesssment/process/:processId/mark-reviewed](#38-post-apiprocess-assesssmentprocessprocessidmark-reviewed)
   - 3.9 [POST /api/process-Assesssment/process/:processId/archive](#39-post-apiprocess-assesssmentprocessprocessidarchive)
   - 3.10 [POST /api/process-Assesssment/rows/bulk-action](#310-post-apiprocess-assesssmentrowsbulk-action)
   - 3.11 [POST /api/process-Assesssment/rows/copy-assessment-data](#311-post-apiprocess-assesssmentrowscopy-assessment-data)
   - 3.12 [POST /api/process-Assesssment/tasks/:taskId/approve](#312-post-apiprocess-assesssmenttaskstaskidapprove)
   - 3.13 [POST /api/process-Assesssment/tasks/:taskId/return](#313-post-apiprocess-assesssmenttaskstaskidreturn)
   - 3.14 [POST /api/process-Assesssment/tasks/:taskId/reject](#314-post-apiprocess-assesssmenttaskstaskidreject)
   - 3.15 [POST /api/process-Assesssment/tasks/:taskId/request-endorsement](#315-post-apiprocess-assesssmenttaskstaskidrequest-endorsement)
   - 3.16 [POST /api/process-Assesssment/tasks/:taskId/save-field-comments](#316-post-apiprocess-assesssmenttaskstaskidsave-field-comments)
   - 3.17 [POST /api/process-Assesssment/tasks/bulk-approve](#317-post-apiprocess-assesssmenttasksbulk-approve)
   - 3.18 [POST /api/process-Assesssment/tasks/bulk-return](#318-post-apiprocess-assesssmenttasksbulk-return)
   - 3.19 [POST /api/process-Assesssment/tasks/bulk-reject](#319-post-apiprocess-assesssmenttasksbulk-reject)
   - 3.20 [POST /api/process-Assesssment/tasks/bulk-request-endorsement](#320-post-apiprocess-assesssmenttasksbulk-request-endorsement)
   - 3.21 [GET /api/process-Assesssment/tasks/:taskId](#321-get-apiprocess-assesssmenttaskstaskid)
   - 3.22 [GET /api/process-Assesssment/tasks/:taskId/workflow-history](#322-get-apiprocess-assesssmenttaskstaskidworkflow-history)
   - 3.23 [GET /api/process-Assesssment/field-comments](#323-get-apiprocess-assesssmentfield-comments)
   - 3.24 [POST /api/process-Assesssment/field-comments](#324-post-apiprocess-assesssmentfield-comments)
   - 3.25 [GET /api/process-Assesssment/process-comments](#325-get-apiprocess-assesssmentprocess-comments)
   - 3.26 [GET /api/process-Assesssment/process-comments/:fieldId](#326-get-apiprocess-assesssmentprocess-commentsfieldid)
   - 3.27 [GET /api/process-Assesssment/business-units](#327-get-apiprocess-assesssmentbusiness-units)
   - 3.28 [GET /api/process-Assesssment/digital-teams](#328-get-apiprocess-assesssmentdigital-teams)

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

### 3.1 GET `/api/process-Assesssment/rows`

**Response — `data: ProcessItem[]`**

```json
{
  "data": [
    {
      "id": "d1",
      "domain": "Exploration & Planning",
      "level1Items": [
        {
          "id": "l1-1",
          "level1Name": "Exploration",
          "level1Code": "EXP.1",
          "level2Items": [
            {
              "id": "l2-1",
              "level2Name": "Regional Studies",
              "level2Code": "EXP.1.1",
              "level3Items": [
                {
                  "id": "l3-1",
                  "level3Name": "Basin Modeling",
                  "level3Code": "EXP.1.1.3",
                  "groupCompany": "ADNOC SA",
                  "status": "Pending approval",
                  "site": "A",
                  "description": "Define the structural and stratigraphic framework of the basin, including major faults, horizons, and depositional environments.",
                  "centrallyGovernedProcess": "Yes",
                  "sharedService": { "services": ["ADNOC Offshore"], "shared": [""] },
                  "businessUnit": ["Exploration"],
                  "ResponsibleDigitalTeam": ["Subsurface Digitalization"],
                  "processCriticality": "Standard",
                  "UsersImpacted": "Small (1-50)",
                  "scaleOfProcess": "Medium: (bigger team within one department)",
                  "automationMaturityLevel": "Fully Automated",
                  "automationLevel": "10%",
                  "currentApplicationsSystems": [
                    { "id": "excel", "name": "Microsoft 365 - Excel" }
                  ],
                  "OngoingAutomationDigitalInitiatives": "N/A",
                  "businessRecommendationForAutomation": "Should be kept as is",
                  "keyChallengesAutomationNeeds": "none",
                  "AIPowered": "No",
                  "AIPoweredUseCase": "",
                  "autonomousUseCaseEnabled": "No",
                  "AutonomousUseCaseDescriptionComment": "N/A",
                  "ProcessCycle": "Annually",
                  "processRepetitionWithinCycle": "1",
                  "totalPersonnelExecutingFTE": "5",
                  "totalProcessDurationDays": "30",
                  "timeSpentOnManualTasksPercent": "80%",
                  "keyManualSteps": "<p>1.Data collection</p>",
                  "northStarTargetAutomation": "Keep as is",
                  "targetAutomationLevelPercent": "60%",
                  "SMEFeedback": "",
                  "toBeAIPowered": "Yes",
                  "toBeAIPoweredComments": "",
                  "rateCardAED": "500 AED",
                  "costOfManualEffortAED": "120000 AED",
                  "markedAsReviewed": "false",
                  "reviewedOn": "",
                  "businessFocalPoint": ["name1", "name2"],
                  "digitalFocalPoint": ["name1", "name2"],
                  "publishedDate": "2024-01-15",
                  "submittedBy": "John Doe",
                  "submittedOn": "2024-01-10",
                  "level4Items": [
                    {
                      "id": "l4-1-1",
                      "level4Name": "Define basin framework",
                      "level4Code": "EXP.1.1.3.1",
                      "groupCompany": "ADNOC SA",
                      "status": "Pending approval",
                      "site": "A",
                      "description": "Define the structural and strat.",
                      "centrallyGovernedProcess": "Yes",
                      "sharedService": { "services": ["ADNOC Offshore"], "shared": [""] },
                      "businessUnit": ["Exploration"],
                      "ResponsibleDigitalTeam": ["Subsurface Digitalization"],
                      "processCriticality": "Standard",
                      "UsersImpacted": "Small (1-50)",
                      "scaleOfProcess": "Medium: (bigger team within one department)",
                      "automationMaturityLevel": "Fully Automated",
                      "automationLevel": "10%",
                      "currentApplicationsSystems": [
                        { "id": "excel", "name": "Microsoft 365 - Excel" }
                      ],
                      "OngoingAutomationDigitalInitiatives": "N/A",
                      "businessRecommendationForAutomation": "Should be kept as is",
                      "keyChallengesAutomationNeeds": "none",
                      "AIPowered": "No",
                      "AIPoweredUseCase": "",
                      "autonomousUseCaseEnabled": "No",
                      "AutonomousUseCaseDescriptionComment": "N/A",
                      "ProcessCycle": "Annually",
                      "processRepetitionWithinCycle": "1",
                      "totalPersonnelExecutingFTE": "5",
                      "totalProcessDurationDays": "30",
                      "timeSpentOnManualTasksPercent": "80%",
                      "keyManualSteps": "<p>1.Data collection</p>",
                      "northStarTargetAutomation": "Keep as is",
                      "targetAutomationLevelPercent": "60%",
                      "SMEFeedback": "Significant time spent.",
                      "toBeAIPowered": "Yes",
                      "toBeAIPoweredComments": "text.",
                      "rateCardAED": "500 AED",
                      "costOfManualEffortAED": "120000 AED",
                      "markedAsReviewed": "false",
                      "reviewedOn": "",
                      "businessFocalPoint": ["name1", "name2"],
                      "digitalFocalPoint": ["name1", "name2", "name"],
                      "publishedDate": "2024-01-15",
                      "submittedBy": "John Doe",
                      "submittedOn": "2024-01-10",
                      "draftVersion":{}
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "message": "OK",
  "success": true
}
```

---

### 3.2 GET `/api/process-Assesssment/my-tasks`

Returns tasks assigned to the current user that need action.

**Response — `data: TaskItem[]`**

```json
{
  "data": [
    {
      "id": "",
      "processId": "",
      "groupCompany": "",
      "processName": "",
      "requestId": "",
      "domain": "",
      "stageCurrent": 1,
      "stageTotal": 3,
      "stageText": "",
      "requester": "",
      "status": "",
      "returnComment": "",
      "actionRequired": "",
      "submittedOn": "08 Apr 2024",
      "changes": [
        {
          "name": "",
          "comment": "",
          "oldValue": "",
          "newValue": ""
        }
      ]
    }
  ],
  "message": "OK",
  "success": true
}
```

| Field            | Type             | Required | Description                                    |
| ---------------- | ---------------- | -------- | ---------------------------------------------- |
| `id`             | `string`         | ✅       | Task identifier                                |
| `processId`      | `string` (UUID)  | ❌       | FK for deep-link navigation to Assesssment row |
| `processName`    | `string`         | ✅       | Display name                                   |
| `requestId`      | `string`         | ✅       | Associated change request ID                   |
| `domain`         | `string`         | ✅       | Domain name                                    |
| `stageCurrent`   | `number`         | ✅       | Current workflow stage (1-based)               |
| `stageTotal`     | `number`         | ✅       | Total workflow stages                          |
| `stageText`      | `string`         | ✅       | Label for current stage                        |
| `requester`      | `string`         | ✅       | Name of person who submitted                   |
| `status`         | `ProcessStatus`  | ✅       | Current status                                 |
| `returnComment`  | `string \| null` | ❌       | Populated when status is `"Returned"`          |
| `returnedBy`     | `string \| null` | ❌       | Who returned it                                |
| `actionRequired` | `string \| null` | ❌       | What the user needs to do                      |
| `submittedOn`    | `string \| null` | ❌       | Submission date                                |
| `changes`        | `ChangeRecord[]` | ❌       | List of field-level changes (see below)        |

**`ChangeRecord`:**

| Field      | Type     | Description              |
| ---------- | -------- | ------------------------ |
| `name`     | `string` | Field that changed       |
| `comment`  | `string` | `"Update"` or `"Create"` |
| `oldValue` | `string` | Previous value           |
| `newValue` | `string` | New value                |

---

### 3.3 GET `/api/process-Assesssment/submitted-requests`

**Response — `data:[]`**
Returns change requests submitted by (or visible to) the current user.

```json
{
  "data": [

  {
    "id": "",
    "processId": "",
    "processCode":"",
    "domain": "",
    "processName": '"",
    "requestId": "",
    "requester": "",
    "status": "",
    "stageCurrent": 1,
    "stageTotal": 1,
    "stageText": "",
    "submittedOn": "",
    "returnComment":"",
    "changes": [
      {
        "id": "",
        "label": "",
        "oldValue": "",
        "newValue": "",
      }
    ],
  },
  ]
}
```

### 3.4 GET `/api/process-Assesssment/process/:processId`

```json
{
  "data": [
    {
      "name": "",
      "groupCompany": "",
      "domain": "",
      "code": "",
      "status": "",
      "stageCurrent": "",
      "stageTotal": "",
      "processApplicapility": true,
      "lastPublishedDate": "",
      "markedReviewDate": "",
      "level1Name": "",
      "level2Name": "",
      "level3Name": "",
      "level4Name": "",
      "centrallyGovernedProcess": "yes",
      "sharedServiceProcess": "no",
      "customName": "",
      "customDescription": "",
      "processDescription": "",
      "responsibleBusinessFocalPoint": [
        {
          "id": "",
          "name": "",
          "img": "url"
        }
      ],
      "responsibleDigitalFocalPoint": [
        {
          "id": "",
          "name": "",
          "img": "url"
        }
      ],
      "numberOfPeopleInvolved": "",
      "scaleOfProcess": "",
      "automationMaturityLevel": "",
      "automationLevel": "",
      "currentApplicationsSystems": [{ "id": "excel", "name": "Microsoft 365 - Excel" }],
      "OngoingAutomationDigitalInitiatives": "",
      "businessRecommendationForAutomation": "",
      "keyChallengesAutomationNeeds": "",
      "AIPowered": "No",
      "AIPoweredUseCase": "",
      "autonomousUseCaseEnabled": "No",
      "AutonomousUseCaseDescriptionComment": "",
      "processCriticality": "",
      "keyManualSteps": "<p>test</p>",
      "northStarTargetAutomation": "",
      "targetAutomationLevelPercent": "",
      "SMEFeedback": "",
      "toBeAIPowered": "",
      "toBeAIPoweredComments": "",
      "opportunities": [
        {
          "id": "",
          "opportunity": "",
          "description": "",
          "domain": ""
        }
      ],
      "changes": [
        {
          "name": "",
          "comment": "",
          "oldValue": "",
          "newValue": "",
          "changeType": "",
          "modifiedBy": "",
          "modifiedOn": ""
        }
      ],

      "comments": [
        {
          "username": "",
          "userPrfileImg": "",
          "comment": "",
          "date": "",
          "status": "",
          "markedAsReviewed": false
        }
      ]
    }
  ]
}
```

Returns process details for the requested process.

---

### 3.5 POST `/api/process-Assesssment/rows/save-draft`

Saves the edited assessment rows currently marked as changed in the UI.

**Request body — `FlatAssessmentRow[]`**

```json
[
  {
    "id": "d1-l1-l2-l3-l4",
    "description": "Updated description",
    "businessUnit": ["Exploration"],
    "responsibleDigitalTeam": ["Data Analytics"],
    "readyForSave": true
  }
]
```

**Response**

```json
{
  "data": {
    "success": true,
    "savedIds": ["d1-l1-l2-l3-l4"],
    "message": "Assessment draft rows saved successfully."
  },
  "message": "OK",
  "success": true
}
```

---

### 3.6 POST `/api/process-Assesssment/process/:processId/submit`

Submits a single process row.
**Request body — `FlatAssessmentRow[]`**

````json
[
  {
                  "description": "",
                  "centrallyGovernedProcess": "Yes",
                  "sharedService": {"services":["ADNOC Offshore"],"shared":[""]},
                  "businessUnit": ["Exploration"],
                  "ResponsibleDigitalTeam": ["Subsurface Digitalization"],
                  "processCriticality": "Standard",
                  "UsersImpacted": "Small (1-50)",
                  "scaleOfProcess": "Medium: (bigger team within one department)",
                  "automationMaturityLevel": "Fully Automated",
                  "automationLevel": "10%",
                  "currentApplicationsSystems": [{"id":"excel" , "name":"Microsoft 365 - Excel"}],
                  "OngoingAutomationDigitalInitiatives": "N/A",
                  "businessRecommendationForAutomation": "Should be kept as is",
                  "keyChallengesAutomationNeeds": "none",
                  "AIPowered": "No",
                  "AIPoweredUseCase": "",
                  "autonomousUseCaseEnabled": "No",
                  "AutonomousUseCaseDescriptionComment": "N/A",
                  "ProcessCycle": "Annually",
                  "processRepetitionWithinCycle": "1",
                  "totalPersonnelExecutingFTE": "5",
                  "totalProcessDurationDays": "30",
                  "timeSpentOnManualTasksPercent": "80%",
                  "keyManualSteps": "<p>1.Data collection</p>",
                  "northStarTargetAutomation": "Keep as is",
                  "targetAutomationLevelPercent": "60%",
                  "SMEFeedback": "",
                  "toBeAIPowered": "Yes",
                  "toBeAIPoweredComments": "",
                  "rateCardAED": "500 AED",
                  "costOfManualEffortAED": "120000 AED",
                  "markedAsReviewed": "false",
                  "reviewedOn": "",
                  "businessFocalPoint": ["name1","name2"],
                  "digitalFocalPoint": ["name1","name2"],
                  "publishedDate": "2024-01-15",
  }
]

**Response**

```json
{
  "data": {
    "success": true,
    "message": "Process submitted successfully."
  },
  "message": "OK",
  "success": true
}
````

---

### 3.7 POST `/api/process-Assesssment/process/:processId/switch-to-draft`

Switches a process back to draft status.

**Response**

```json
{
  "data": {
    "success": true,
    "status": "Draft",
    "message": "Process switched to draft."
  },
  "message": "OK",
  "success": true
}
```

---

### 3.8 POST `/api/process-Assesssment/process/:processId/mark-reviewed`

Marks a process as reviewed.

**Response**

```json
{
  "data": {
    "success": true,
    "message": "Process marked as reviewed successfully."
  },
  "message": "OK",
  "success": true
}
```

---

### 3.9 POST `/api/process-Assesssment/process/:processId/archive`

Archives a process row.

**Response**

```json
{
  "data": {
    "success": true,
    "status": "Archived",
    "message": "Process archived successfully."
  },
  "message": "OK",
  "success": true
}
```

---

### 3.10 POST `/api/process-Assesssment/rows/bulk-action`

Applies a bulk action to multiple rows.

**Request body**

```json
// [
//   {
//     "rowId": "row-1",
//     "level": "l4",
//     "columnKey": "description",
//     "action": "edit",
//     "payload": "New value"
//   }
// ]
```

**Response**

```json
{
  "data": {
    "processedIds": ["row-1"]
  },
  "message": "OK",
  "success": true
}
```

---

### 3.11 POST `/api/process-Assesssment/rows/copy-assessment-data`

Copies one source row's assessment data into multiple target rows.

**Request body**

```json
{
  "targetIds": ["row-1", "row-2"],
  "sourceId": "row-9"
}
```

**Response**

```json
{
  "data": {
    "updatedIds": ["row-1", "row-2"]
  },
  "message": "OK",
  "success": true
}
```

---

### 3.12 POST `/api/process-Assesssment/tasks/:taskId/approve`

Approves one task.

**Request body**

```json
{
  "comment": "Looks good."
}
```

**Response**

```json
{
  "data": {
    "success": true
  },
  "message": "OK",
  "success": true
}
```

---

### 3.13 POST `/api/process-Assesssment/tasks/:taskId/return`

Returns one task to the requester.

**Request body**

```json
{
  "reason": "Please update the business unit.",
  "comment": "Needs correction"
}
```

---

### 3.14 POST `/api/process-Assesssment/tasks/:taskId/reject`

Rejects one task.

**Request body**

```json
{
  "reason": "Invalid submission",
  "comment": "Rejected by reviewer"
}
```

---

### 3.15 POST `/api/process-Assesssment/tasks/:taskId/request-endorsement`

Requests endorsement from selected users.

**Request body**

```json
{
  "endorserNames": ["Sara Al Mansouri", "Maryam Al Shamsi"],
  "reason": "Please review this process."
}
```

---

### 3.16 POST `/api/process-Assesssment/tasks/:taskId/save-field-comments`

Commits the pending field comments for a task.

**Response**

```json
{
  "data": {
    "success": true
  },
  "message": "OK",
  "success": true
}
```

---

### 3.17 POST `/api/process-Assesssment/tasks/bulk-approve`

Bulk-approves tasks.

**Request body**

```json
{
  "taskIds": ["task-1", "task-2"]
}
```

**Response**

```json
{
  "data": {
    "approvedIds": ["task-1", "task-2"]
  },
  "message": "OK",
  "success": true
}
```

---

### 3.18 POST `/api/process-Assesssment/tasks/bulk-return`

Bulk-returns tasks.

**Request body**

```json
{
  "taskIds": ["task-1", "task-2"],
  "reason": "Please complete missing fields."
}
```

---

### 3.19 POST `/api/process-Assesssment/tasks/bulk-reject`

Bulk-rejects tasks.

**Request body**

```json
{
  "taskIds": ["task-1", "task-2"],
  "reason": "Invalid requests."
}
```

---

### 3.20 POST `/api/process-Assesssment/tasks/bulk-request-endorsement`

Bulk-requests endorsement for tasks.

**Request body**

```json
{
  "taskIds": ["task-1", "task-2"],
  "endorserNames": ["User 1", "User 2"],
  "reason": "Please endorse."
}
```

---

### 3.21 GET `/api/process-Assesssment/tasks/:taskId`

Returns one task details object.

**Response — `data: TaskItem | null`**

---

### 3.22 GET `/api/process-Assesssment/tasks/:taskId/workflow-history`

Returns workflow history for a task.

**Response — `data: WorkflowHistoryItem[]`**

```json
{
  "data": [
    {
      "id": "wh-1",
      "action": "Submitted",
      "date": "10 Apr 2026 at 09:00 AM",
      "userName": "Mohammed Al Rashid",
      "userRole": "Business FP"
    }
  ],
  "message": "OK",
  "success": true
}
```

---

### 3.23 GET `/api/process-Assesssment/field-comments`

Returns field comments for one task field.

**Query params**

| Name        | Type     | Required |
| ----------- | -------- | -------- |
| `taskId`    | `string` | ✅       |
| `fieldName` | `string` | ✅       |

**Response — `data: CommentEntry[]`**
  id: string
  author: string
  role: string
  text: string
  timestamp: string

---

### 3.24 POST `/api/process-Assesssment/field-comments`

Adds one comment to a task field.

**Request body**

```json
{
  "taskId": "task-1",
  "fieldName": "Automation level 1",
  "text": "Please review the automation level."
}
```

**Response — `data: CommentEntry`**
  id: string
  author: string
  role: string
  text: string
  timestamp: string

---

<!-- ### 3.25 GET `/api/process-Assesssment/process-comments`

Returns the process-level comments collection.

**Response**

```json
{
  "data": [],
  "message": "OK",
  "success": true
}
``` -->

---

### 3.26 GET `/api/process-Assesssment/process-comments/:fieldId`

Returns comments for a specific process field.

**Response**

```json
{
  "data": [],
  "message": "OK",
  "success": true
}
```

---

### 3.27 GET `/api/process-Assesssment/business-units`

Returns the BU tree used by the Business Unit sheet.

**Response — `data: TreeNode[]`**

```json
{
  "data": [
    {
      "label": "Shared service",
      "value": "shared service",
      "children": [
        {
          "label": "Procurement",
          "value": "procurement"
        }
      ]
    }
  ],
  "message": "OK",
  "success": true
}
```

---

### 3.28 GET `/api/process-Assesssment/digital-teams`

Returns the Digital Team tree used by the Digital Team sheet.

**Response — `data: TreeNode[]`**

```json
{
  "data": [
    {
      "label": "Business Support",
      "value": "Business Support",
      "children": [
        {
          "label": "Digital Operations",
          "value": "Digital Operations"
        }
      ]
    }
  ],
  "message": "OK",
  "success": true
}
```
