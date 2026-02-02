const TOPIC_MINE_CONFIG = {
  baseUrl: 'https://YOUR_CLOUD_RUN_URL',
  pollIntervalMs: 5000,
  maxPolls: 30,
};

function runTopicMineAppscriptDemo() {
  const payload = {
    num_headlines: 3,
    num_descriptions: 2,
    first_term_source_config: {
      terms: ['Trail running shoes', 'Smart water bottle'],
      descriptions: ['Lightweight trail runners', 'Insulated bottle with tracking'],
      skus: ['SKU-TRAIL-01', 'SKU-WATER-02'],
      urls: ['https://example.com/trail', 'https://example.com/bottle'],
      image_urls: ['https://example.com/trail.jpg', 'https://example.com/bottle.jpg'],
    },
    second_term_source_config: {
      terms: ['Spring fitness', 'Hydration goals'],
      descriptions: ['Seasonal training plan', 'Daily hydration reminders'],
    },
    url_validation: 'USE_DEFAULT_URL',
    default_url: 'https://example.com',
  };

  const taskId = startTopicMineTask(payload);
  const result = waitForTopicMineResult(taskId);
  Logger.log(JSON.stringify(result, null, 2));
}

function startTopicMineTask(payload) {
  const url = `${TOPIC_MINE_CONFIG.baseUrl}/content` +
    '?destination=appscript' +
    '&first-term-source=appscript' +
    '&second-term-source=appscript' +
    '&must-find-relationship=false';
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const data = JSON.parse(response.getContentText());
  if (response.getResponseCode() !== 202) {
    throw new Error(`Topic Mine request failed: ${response.getContentText()}`);
  }
  return data.task_id;
}

function waitForTopicMineResult(taskId) {
  for (let i = 0; i < TOPIC_MINE_CONFIG.maxPolls; i++) {
    const response = UrlFetchApp.fetch(
      `${TOPIC_MINE_CONFIG.baseUrl}/tasks/${taskId}`,
      { muteHttpExceptions: true }
    );
    const data = JSON.parse(response.getContentText());
    if (data.status === 'completed') {
      return data.result;
    }
    if (data.status && data.status.startsWith('failed')) {
      throw new Error(`Topic Mine failed: ${data.result}`);
    }
    Utilities.sleep(TOPIC_MINE_CONFIG.pollIntervalMs);
  }
  throw new Error('Topic Mine timed out waiting for results.');
}
