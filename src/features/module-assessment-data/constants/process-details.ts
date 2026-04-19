export const PROESS_DETAILS = [
  {
    name: 'Define basin framework',
    groupCompany: '12345',
    domain: 'Process 1',
    code: 'SGSAUD.1.1.3.1',
    status: 'Draft',
    stageCurrent: '1',
    stageTotal: '3',
    processApplicapility: true,
    lastPublishedDate: '2024-01-01',
    markedReviewDate: '2024-12-31',
    level1Name: 'Exploration',
    level2Name: 'Regional studies',
    level3Name: 'Basin Modeling',
    level4Name: 'Define basin framework',
    centrallyGovernedProcess: 'yes',
    sharedServiceProcess: 'no',
    customName: 'Default Name',
    customDescription: 'Default Description',
    processDescription: 'Default Process Description',
    responsibleBusinessFocalPoint: [
      {
        id: 'user1',
        name: 'Fatima Al Nuaimi',
        img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
      },
    ],
    responsibleDigitalFocalPoint: [
      {
        id: 'user12',
        name: 'Ahmed Al Mansoori',
        img: 'https://t4.ftcdn.net/jpg/06/45/77/79/360_F_645777959_fNnaNoeVO4qxCNPW9MWr3gQlPFSGA9yL.jpg',
      },
    ],
    numberOfPeopleInvolved: 'High (500-1000)',
    scaleOfProcess: 'Medium: (bigger team within one department)',
    automationMaturityLevel: 'Fully Automated',
    automationLevel: '10%',
    currentApplicationsSystems: ['Microsot Excel', 'Petrel'],
    OngoingAutomationDigitalInitiatives: 'N/A',
    businessRecommendationForAutomation: 'Should be kept as is',
    keyChallengesAutomationNeeds: 'none',
    AIPowered: 'No',
    AIPoweredUseCase: '',
    autonomousUseCaseEnabled: 'No',
    AutonomousUseCaseDescriptionComment: 'N/A',
    processCriticality: 'Standard',
    keyManualSteps: '<p>1.Data collection</p>',
    northStarTargetAutomation: 'To be intelligent',
    targetAutomationLevelPercent: '60%',
    SMEFeedback:
      'Significant time spent on manual data collection and model setup. Automation could free up time for more value-added analysis.',
    toBeAIPowered: 'Yes',
    toBeAIPoweredComments:
      'AI could be used to assist with result interpretation and identify patterns in the data.',
    opportunities: [
      {
        id: 'AUD1',
        opportunity: 'Continuous Control Monitoring System Implementation',
        description:
          'Implementing Continuous Control Monitoring (CCM) offers significant benefits by enabling ADNOC to manage risks proactively, enhance compliance, and improve operational efficiency. By providing real-time insights into control effectiveness, CCM helps in the early detection of issues, allowing for timely corrective actions and reducing the potential impact of control failures. This continuous oversight also streamlines audits, minimizes manual checks, and ensures resources are allocated effectively. Overall, CCM fosters a robust control environment, strengthens internal processes, and boosts organizational resilience and accountability.',
        domain: 'Audit & Assurance',
      },
      {
        id: 'AUD2',
        opportunity: 'Integration of Digital Tools with Archer',
        description:
          'Implementing Continuous Control Monitoring (CCM) offers significant benefits by enabling ADNOC to manage risks proactively, enhance compliance, and improve operational efficiency. By providing real-time insights into control effectiveness, CCM helps in the early detection of issues, allowing for timely corrective actions and reducing the potential impact of control failures. This continuous oversight also streamlines audits, minimizes manual checks, and ensures resources are allocated effectively. Overall, CCM fosters a robust control environment, strengthens internal processes, and boosts organizational resilience and accountability.',
        domain: 'Audit & Assurance',
      },
      {
        id: 'AUD3',
        opportunity: 'Audit Committee Management and Reporting',
        description:
          'Implementing Continuous Control Monitoring (CCM) offers significant benefits by enabling ADNOC to manage risks proactively, enhance compliance, and improve operational efficiency. By providing real-time insights into control effectiveness, CCM helps in the early detection of issues, allowing for timely corrective actions and reducing the potential impact of control failures. This continuous oversight also streamlines audits, minimizes manual checks, and ensures resources are allocated effectively. Overall, CCM fosters a robust control environment, strengthens internal processes, and boosts organizational resilience and accountability.',
        domain: 'Audit & Assurance',
      },
    ],
    changes: [
      {
        name: 'Automation level',
        comment:
          'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
        changeType: 'Update',
        modifiedBy: 'Leen Shehadeh',
        modifiedOn: '2026-10-10',
      },
      {
        name: 'Automation level',
        comment:
          'The proposed automation level of 65% seems low based on the process information. It should likely be above 80%.',
        oldValue: '10%',
        newValue: '40%',
        changeType: 'Update',
        modifiedBy: 'Leen Shehadeh',
        modifiedOn: '2026-10-10',
      },
    ],

    comments:[
      {
        username:'Ali Abdullah',
        userPrfileImg:'',
        comment:'please fill out the sutomation steps ',
        date:'2026-10-10',
        status:'Draft',
        markedAsReviewed:false
      },
      {
        username:'Ahmad Al Ezz',
        userPrfileImg:'',
        comment:'All are up to date',
        date:'2026-10-10',
        status:'Published',
        markedAsReviewed:true
      }
    ],

    orgMapping:{
      BU:[{unit:'Shared service',subUnits:['supplier evaluation']}],
      DT:[{unit:'Business Support',subUnits:['Data Analytics']}],
    }
  },
]
