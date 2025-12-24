let lastSongInfo = { title: "", artist: "" };

function getSongInfo() {
  // Try multiple strategies
  const strategies = [
    // Strategy 1: Player bar
    () => {
      const playerBar = document.querySelector("ytmusic-player-bar");
      if (playerBar) {
        const title = playerBar
          .querySelector('h1, yt-formatted-string, [class*="title"]')
          ?.textContent?.trim();
        const artist = playerBar
          .querySelector('.subtitle, .secondary, [class*="artist"]')
          ?.textContent?.trim();
        return { title, artist };
      }
    },

    // Strategy 2: Queue/now playing
    () => {
      const queueItem = document.querySelector(
        'ytmusic-player-queue-item-renderer, [class*="now-playing"]'
      );
      if (queueItem) {
        const title = queueItem
          .querySelector("yt-formatted-string, h3")
          ?.textContent?.trim();
        const artist = queueItem
          .querySelector('[class*="subtitle"]')
          ?.textContent?.trim();
        return { title, artist };
      }
    },

    // Strategy 3: Miniplayer
    () => {
      const miniplayer = document.querySelector(
        '[class*="miniplayer"], [class*="compact"]'
      );
      if (miniplayer) {
        const title = miniplayer
          .querySelector("h1, h2, yt-formatted-string")
          ?.textContent?.trim();
        return { title };
      }
    },

    // Strategy 4: Any title-like text in player area
    () => {
      const playerArea = document.querySelector(
        'main, [role="main"], ytmusic-app-layout'
      );
      if (playerArea) {
        const title = Array.from(
          playerArea.querySelectorAll("h1, h2, h3, yt-formatted-string")
        )
          .find(
            (el) =>
              el.textContent?.trim().length > 3 && el.textContent.length < 80
          )
          ?.textContent?.trim();
        return { title };
      }
    },
  ];

  for (const strategy of strategies) {
    try {
      const info = strategy();
      if (info.title) return info;
    } catch (e) {}
  }

  return null;
}

function checkSongChange() {
  const songInfo = getSongInfo();

  if (
    songInfo &&
    songInfo.title &&
    (songInfo.title !== lastSongInfo.title ||
      songInfo.artist !== lastSongInfo.artist)
  ) {
    lastSongInfo = songInfo;
    console.log(
      "🎵 NEW SONG:",
      songInfo.title.substring(0, 50),
      songInfo.artist?.substring(0, 30)
    );

    // With direct notification:
    if (Notification.permission === "granted") {
      const musicIconDataUrl =
        "data:image/png;base64,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";
      new Notification(songInfo.title, {
        body: songInfo.artist || "Now playing",
        icon: musicIconDataUrl,
      });
    }
    console.log("🔔 Direct notification sent");
  }
}

// MutationObserver for dynamic content
const observer = new MutationObserver(() => {
  checkSongChange();
});

function startMonitoring() {
  // Start polling + observe changes
  checkSongChange();
  setInterval(checkSongChange, 2500);

  // Observe DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "data"],
  });

  console.log("🎵 YouTube Music Notifier started");
}

// Permission + start
document.addEventListener(
  "click",
  () => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  },
  { once: true }
);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    setTimeout(startMonitoring, 1000)
  );
} else {
  setTimeout(startMonitoring, 1000);
}
