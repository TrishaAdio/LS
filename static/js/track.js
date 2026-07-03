/* =========================================================================
   track.js — lightweight first-party visit tracker.
   Starts a per-tab session, heartbeats every 15s, and flushes when the tab
   is hidden/closed (via sendBeacon). Server computes "tab open time" as
   last_seen - started. Fails silently — never blocks the app.
   ========================================================================= */
(function () {
  var KEY = "mls_track_sid";
  var sid = null;
  try { sid = sessionStorage.getItem(KEY); } catch (e) {}

  function send(url, data, beacon) {
    try {
      var body = JSON.stringify(data);
      if (beacon && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
        return;
      }
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true,
      }).catch(function () {});
    } catch (e) {}
  }

  // Begin (or resume, within the same tab) a session.
  try {
    fetch("/api/track/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sid: sid, path: location.pathname + location.hash }),
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.sid) { sid = d.sid; try { sessionStorage.setItem(KEY, sid); } catch (e) {} }
      })
      .catch(function () {});
  } catch (e) {}

  function ping(beacon) { if (sid) send("/api/track/ping", { sid: sid }, beacon); }

  // Regular heartbeat while the tab is open.
  setInterval(function () { if (document.visibilityState !== "hidden") ping(false); }, 15000);

  // Flush the final timestamp when the tab is hidden or closed.
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") ping(true);
  });
  window.addEventListener("pagehide", function () { ping(true); });
  window.addEventListener("beforeunload", function () { ping(true); });
})();
