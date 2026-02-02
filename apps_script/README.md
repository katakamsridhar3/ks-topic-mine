# Topic Mine Apps Script quickstart

This folder contains a minimal Apps Script client that submits inline payloads to Topic Mine
and returns results without relying on Google Sheets for input/output.

## Deploy steps

1. Deploy the Topic Mine API (Cloud Run, GKE, etc.) and copy the base URL.
2. Open [script.new](https://script.new) and paste the contents of `TopicMineApp.gs`.
3. Update `TOPIC_MINE_CONFIG.baseUrl` to your deployment URL.
4. Run `runTopicMineAppscriptDemo()` from the Apps Script editor.

## Payload notes

- The Apps Script client uses `first-term-source=appscript` and
  `second-term-source=appscript` to send inline arrays in the request body.
- The API returns results in the task payload when `destination=appscript`.

You can adapt `runTopicMineAppscriptDemo()` to read inputs from a UI or
from Script Properties and write the output wherever you need.
