const TOKEN = "eyJ...";
const API_BASE_URL = "api.karotter.com";
const REFERER_URL = "https://karotter.com";
const CLIENT_TYPE = "web";
const CSRF_UUID = "";
const DEVICE_UUID = "";
const BOT_ID = "";

const START_ID = 37728;
const END_ID = 45000;
const BATCH_SIZE = 5;
const DELAY_MS = 5000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function blockUser(userId) {
  try {
    const blockUrl = `https://${API_BASE_URL}/api/follow/block/${userId}`;
    const res = await fetch(blockUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        referer: REFERER_URL,
        "x-client-type": CLIENT_TYPE,
        "x-csrf-token": CSRF_UUID,
        "x-device-id": DEVICE_UUID,
        "x-active-account-id": BOT_ID,
        "Content-Type": "application/json"
      }
    });
    if (res.ok) {
      console.log(`[ID: ${userId}] ブロック成功 (Status: ${res.status})`);
    } else {
      console.warn(`[ID: ${userId}] ブロック失敗/スキップ (Status: ${res.status})`);
    }
  } catch (e) {
    console.error(`[ID: ${userId}] 通信エラー:`, e);
  }
}

async function parallelBlock() {
  console.log(`${START_ID} から ${END_ID} までのブロック処理を開始します...`);
  let currentId = START_ID;
  while (currentId <= END_ID) {
    const tasks = [];
    for (let i = 0; i < BATCH_SIZE && currentId <= END_ID; i++) {
      tasks.push(blockUser(currentId));
      currentId++;
    }
    await Promise.all(tasks);
    await sleep(DELAY_MS);
  }
  console.log("すべてのブロック処理が完了しました。");
}

// 実行開始
parallelBlock();
