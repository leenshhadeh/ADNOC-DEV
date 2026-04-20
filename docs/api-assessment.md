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
   - 3.4 [GET /api/process-Assesssment/process/:processDetails](#34-get-processDetails)
   - 3.5 [GET /api/process-Assesssment/process/:processDetails/opportunities](#35-get-apiprocess-requests-opportunities)


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

Returns the full process hierarchy (Domain → Level 1 → Level 2 → Level 3 → level4) flattened into rows. Each row represents a unique Level 4 or Level 3 process.

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
                  "sharedService": {
                    "services": 12,
                    "shared": 3
                  },
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
                      "sharedService": {
                        "services": 12,
                        "shared": 3
                      },
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
                      "SMEFeedback": "Significant time spent.",
                      "toBeAIPowered": "Yes",
                      "toBeAIPoweredComments": "text.",
                      "rateCardAED": "500 AED",
                      "costOfManualEffortAED": "120000 AED",
                      "markedAsReviewed": "false",
                      "reviewedOn": "",
                      "businessFocalPoint": ["name1","name2"],
                      "digitalFocalPoint": ["name1","name2","name"],
                      "publishedDate": "2024-01-15",
                      "submittedBy": "John Doe",
                      "submittedOn": "2024-01-10"
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
    "groupCompany":"",
    "processName":"",
    "requestId": "",
    "domain":"",
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
        "newValue": "",
      },
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

| Field        | Type     | Description              |
| ------------ | -------- | ------------------------ |
| `name`       | `string` | Field that changed       |
| `comment`    | `string` | `"Update"` or `"Create"` |
| `oldValue`   | `string` | Previous value           |
| `newValue`   | `string` | New value                |

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

### 3.4 GET processDetails


```json
{
  "data": [
  {
    "name": "",
    "groupCompany": "",
    "domain":"",
    "code": "",
    "status": "",
    "stageCurrent": "",
    "stageTotal": "",
    "processApplicapility": true,
    "lastPublishedDate": "",
    "markedReviewDate": "",
    "level1Name": "",
    "level2Name": "",
    "level3Name":"",
    "level4Name": "",
    "centrallyGovernedProcess": "yes",
    "sharedServiceProcess": "no",
    "customName":"",
    "customDescription": "",
    "processDescription": "",
    "responsibleBusinessFocalPoint": [
      {
        "id": "",
        "name": "",
        "img": "url",
      },
    ],
    "responsibleDigitalFocalPoint": [
      {
         "id": "",
        "name": "",
        "img": "url",
      },
    ],
    "numberOfPeopleInvolved": "",
    "scaleOfProcess": "",
    "automationMaturityLevel":  "",
    "automationLevel":  "",
    "currentApplicationsSystems": [{"id":"excel" , "name":"Microsoft 365 - Excel"}],
    "OngoingAutomationDigitalInitiatives":  "",
    "businessRecommendationForAutomation":  "",
    "keyChallengesAutomationNeeds":  "",
    "AIPowered":  "No",
    "AIPoweredUseCase":  "",
    "autonomousUseCaseEnabled": "No",
    "AutonomousUseCaseDescriptionComment":  "",
    "processCriticality":  "",
    "keyManualSteps":  "<p>test</p>",
    "northStarTargetAutomation": "",
    "targetAutomationLevelPercent": "",
    "SMEFeedback":"",
    "toBeAIPowered":"",
    "toBeAIPoweredComments":"",
    "opportunities": [
      {
        "id": "",
        "opportunity": "",
        "description":"",
        "domain": "",
      },
      
    ],
    "changes": [
      {
        "name": "",
        "comment":"",
        "oldValue": "",
        "newValue": "",
        "changeType": "",
        "modifiedBy":"",
        "modifiedOn": "",
      },
  
    ],

    "comments":[
      {
        "username":"",
        "userPrfileImg":"",
        "comment":"",
        "date":"",
        "status":"",
        "markedAsReviewed":false
      },
   
    ]
  },
]
}
```