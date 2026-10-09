/**
 * =========================================================================
 * GOOGLE APPS SCRIPT BACKEND FOR NIGERIAN RE WORKFORCE SURVEY
 * =========================================================================
 * 
 * Instructions for the researcher:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click "Extensions" > "Apps Script"
 * 3. Replace all code in the script editor with this file's contents.
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Set Description: "Survey Backend"
 * 7. Set "Execute as": "Me"
 * 8. Set "Who has access": "Anyone" (crucial for anonymous survey submission without sign-in)
 * 9. Click "Deploy" and copy the Web App URL (ends with /exec)
 * 10. Paste the URL into src/config.ts as GOOGLE_APPS_SCRIPT_URL (or set VITE_GOOGLE_APPS_SCRIPT_URL in .env)
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawPayload = e && e.postData && e.postData.contents
      ? e.postData.contents
      : (e && e.parameter && e.parameter.payload ? e.parameter.payload : '');

    if (!rawPayload) {
      return createJsonResponse({
        status: 'error',
        message: 'No payload data received in request (checked postData.contents and parameter.payload).'
      });
    }

    var payload = JSON.parse(rawPayload);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Prepare headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      var initialHeaders = [
        'Submission ID',
        'Submitted At',
        'RESCO / Organisation',
        'Q1 Primary Role',
        'Q1 Role Other',
        'Q2 Placement Duration',
        'Q3 Systems Worked With',
        'Q3 Systems Other',
        'Q4 Primary State',
        'Q4 Multi-State Note',
        'Q5 Struggled Finding Technicians',
        'Q6 Recent Action Taken',
        'Q7 Workforce Challenges Faced',
        'Q7 Challenges Other',
        'Q8 Most Significant Challenge',
        'Q8 Challenge Other',
        'Q9 Delay Frequency',
        'Q10 Main Consequence',
        'Q10 Consequence Other',
        'Q11 Resolution Time',
        'Q12 What Made It Hard',
        'Q13 Where Team Turned First',
        'Q13 Turned First Other',
        'Q14 What Worked Well',
        'Q15 What Did Not Work Well',
        'Q16 Changed Approach',
        'Q17 What Changed & Why',
        'Q18 Observed Spending Money',
        'Q19 Paying For Categories',
        'Q19 Paying For Other',
        'Q20 Spending Trigger',
        'Q21 Urgent Trigger',
        'Q22 Hardest Stage in Lifecycle',
        'Q22 Hardest Stage Other',
        'Q23 Key Case Study Narrative',
        'Q24 Permanent Problem Removal',
        'Q25 Open to Follow-up Chat',
        'Q25 Follow-up Name',
        'Q25 Follow-up Contact',
        'Raw Answers (JSON)',
        'User Agent',
        'Timezone'
      ];
      sheet.appendRow(initialHeaders);
      sheet.getRange(1, 1, 1, initialHeaders.length).setFontWeight('bold').setBackground('#E2ECE5');
      sheet.setFrozenRows(1);
    }

    var a = payload.answers || {};

    // Helper to format array values cleanly
    function formatValue(val) {
      if (val === undefined || val === null) return '';
      if (Array.isArray(val)) return val.join('; ');
      return String(val);
    }

    // Build row matching headers
    var rowData = [
      payload.id || '',
      payload.submittedAt || new Date().toISOString(),
      payload.rescoName || a.rescoName || '',
      formatValue(a.q1_role),
      formatValue(a.q1_role_other),
      formatValue(a.q2_time),
      formatValue(a.q3_systems),
      formatValue(a.q3_systems_other),
      formatValue(a.q4_state),
      formatValue(a.q4_state_other),
      formatValue(a.q5_struggle),
      formatValue(a.q6_recent_action),
      formatValue(a.q7_challenges),
      formatValue(a.q7_challenges_other),
      formatValue(a.q8_significant),
      formatValue(a.q8_significant_other),
      formatValue(a.q9_delay_freq),
      formatValue(a.q10_consequence),
      formatValue(a.q10_consequence_other),
      formatValue(a.q11_time_resolving),
      formatValue(a.q12_hard_to_resolve),
      formatValue(a.q13_where_turned),
      formatValue(a.q13_where_turned_other),
      formatValue(a.q14_worked_well),
      formatValue(a.q15_did_not_work),
      formatValue(a.q16_changed_approach),
      formatValue(a.q17_what_changed),
      formatValue(a.q18_observed_spending),
      formatValue(a.q19_paying_for),
      formatValue(a.q19_paying_for_other),
      formatValue(a.q20_spending_trigger),
      formatValue(a.q21_urgent_trigger),
      formatValue(a.q22_hardest_stage),
      formatValue(a.q22_hardest_stage_other),
      formatValue(a.q23_deep_case_study),
      formatValue(a.q24_remove_one_problem),
      formatValue(a.q25_followup_chat),
      formatValue(a.q25_name),
      formatValue(a.q25_contact),
      JSON.stringify(a),
      payload.metadata ? payload.metadata.userAgent || '' : '',
      payload.metadata ? payload.metadata.timezone || '' : ''
    ];

    sheet.appendRow(rowData);

    return createJsonResponse({
      status: 'success',
      id: payload.id,
      message: 'Survey response logged to Google Sheet.'
    });

  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return createJsonResponse({
    status: 'ready',
    service: 'Nigeria Renewable Energy Workforce Survey Endpoint',
    timestamp: new Date().toISOString()
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
