const TOKEN = "eyJ...";
const API_BASE_URL = "api.karotter.com";
const REFERER_URL = "https://karotter.com";
const CLIENT_TYPE = "web";
const CSRF_UUID = "";
const DEVICE_UUID = "";
const BOT_ID = "";

const SEARCH_WORD = "";
let cursor = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function blockTargetUsers() {
  try {
    let url = `https://${API_BASE_URL}/api/search/posts?q=${encodeURIComponent(SEARCH_WORD)}&limit=20`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        referer: REFERER_URL,
        "x-client-type": CLIENT_TYPE,
        "x-csrf-token": CSRF_UUID,
        "x-device-id": DEVICE_UUID,
        "x-active-account-id": BOT_ID
      }
    });
    const data = await res.json();
    const posts = data.posts || [];
    for (const post of posts) {
      const user = post.user || post.author;
      if (!user) continue;
      const avatar = user.avatarUrl || user.avatar || user.iconUrl;
      const hasNoAvatar = !avatar || avatar === "";
      if (hasNoAvatar) {
        await sleep(1500 + Math.random() * 1500); 
        const blockRes = await fetch(
          `https://${API_BASE_URL}/api/follow/block/${user.id}`,
          {
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
          }
        );
        console.log(`[Block] User ID: ${user.id} (${user.username || user.screenName || 'Unknown'}) Status: ${blockRes.status}`);
      }
    }

    if (data.pagination && data.pagination.hasNext) {
      cursor = data.pagination.nextCursor;
      await sleep(2000);
      blockTargetUsers();
    } else {
      console.log("検索結果の巡回およびブロック処理が完了しました。");
    }
  } catch (e) {
    console.error("エラーが発生しました:", e);
  }
}

blockTargetUsers();
