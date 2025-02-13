let dataConfig = {};

/**
 * Get GitHub's access token.
 * @param {string} code - Authorization code from GitHub OAuth redirect.
 */
async function getAccessToken(code) {
  try {
    if (!code) {
      console.error("Authorization code is missing.");
      return;
    }

    const response = await fetch(dataConfig.ACCESS_TOKEN_URL, {
      method: "POST",
      headers: dataConfig.HEADER,
      body: JSON.stringify({
        client_id: dataConfig.CLIENT_ID,
        client_secret: dataConfig.CLIENT_SECRET,
        code: code,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    getUserInfo(data.access_token);
  } catch (error) {
    console.error("Failed to retrieve access token:", error);
  }
}

/**
 * Get GitHub's user information with the access token and save it in local storage.
 * @param {string} accessToken - GitHub access token.
 */
async function getUserInfo(accessToken) {
  try {
    const response = await fetch(dataConfig.USER_INFO_URL, {
      method: "GET",
      headers: {
        ...dataConfig.HEADER,
        Authorization: `token ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Save user info in storage
    chrome.storage.local.set({
      leetcode_scrapper_username: data.login,
      leetcode_scrapper_token: accessToken,
    });

    // Notify background script
    chrome.runtime.sendMessage({
      type: "saveUserInfos",
      token: accessToken,
      username: data.login,
    });
  } catch (error) {
    console.error("Failed to retrieve user info:", error);
  }
}

// Retrieve config file from the background script
if (window.location.host === "github.com") {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    console.error("GitHub authorization code is missing.");
    return;
  }

  chrome.runtime.sendMessage({ type: "getDataConfig" }).then(
    (response) => {
      dataConfig = response;
      getAccessToken(code);
    },
    (error) => {
      console.error("Failed to retrieve data config:", error);
    }
  );
}
