// update-check.js — ONLY in the single HTML file ("בית המקדש - לצפייה בלי אוצריא.html"); it is never part of the plugin (inside Otzaria
// the store updates the plugin). tools/build-unified.mjs writes it into each house's page of that file, after house-bridge.js.
// The user (10.11.2026): "בקובץ ה-HTML בלבד! הוסף מתג בסוף התפריט עם בדיקת עדכונים מגיט".
// UPDATE_DOWNLOAD_210 (the user, 14.11.2026: "האם הכפתור בדיקת עדכונים יוצר דיאלוג הורדה ושמירה?" — "בודאי מה חשבת לעצמך? זה נועד
// לעזור לאנשים שאין להם אוצריא ומשתמשים רק בקובץ הזה"): when a newer version exists, a second button downloads the new file and saves it.
// Where the new file is: the branch "html" of yoniny/beit-rishon holds two files only - beit-hamikdash.html (this file, of the newest
// version) and version.txt (three lines: the version, the file's size in bytes, its SHA-256). tools/publish-html.sh replaces that branch
// at every release, before main is pushed. raw.githubusercontent.com answers with "Access-Control-Allow-Origin: *", so a page opened from
// the disk may read it. If version.txt cannot be read (no such branch yet), the check falls back to the version of the published plugin
// (unified-plugin/manifest.json on main) and offers the link only.
// The save: showSaveFilePicker (Chrome, Edge) is called first, in the click itself (it needs the click), then the file is downloaded, its
// size and SHA-256 are checked, and only then written - a broken download never replaces a good file. Where the browser has no such
// dialog (Firefox, Safari) or refuses it, the file is handed to the browser as an ordinary download (an <a download>), after the same checks.
// Nothing is asked before the first click, and nothing is sent but the requests themselves.
(function () {
  "use strict";
  var VER = "__PLUGIN_VERSION__", REPO = "yoniny/beit-rishon";
  var RAW = "https://raw.githubusercontent.com/" + REPO + "/";
  var VTXT = RAW + "html/version.txt", HTML = RAW + "html/beit-hamikdash.html";
  var MAN = RAW + "main/unified-plugin/manifest.json";   // 2.0.2: the published folder of the unified plugin
  var PAGE = "https://github.com/" + REPO + "#readme";
  // 2.0.10 (the user: "תוסיף לשם הHTML את שם הגרסה"): the name offered for the new file carries ITS version - the old file is not overwritten unasked
  function fileName(v) { return "בית המקדש - לצפייה בלי אוצריא - גרסה " + v + ".html"; }
  var BTN = "width:100%;padding:6px 8px;border-radius:6px;cursor:pointer;font:inherit;font-size:13px;background:rgba(201,168,76,.10);border:1px solid rgba(201,168,76,.32);color:#e8dcae";
  function cmp(a, b) {
    a = String(a).split("."); b = String(b).split(".");
    for (var i = 0; i < 3; i++) { var d = (+a[i] || 0) - (+b[i] || 0); if (d) return d; }
    return 0;
  }
  function getText(u) {
    return fetch(u + "?t=" + Date.now(), { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    });
  }
  // the newest version: {v, size, sha, file: true} from the branch "html"; else {v, file: false} from the plugin's manifest
  function latest() {
    return getText(VTXT).then(function (t) {
      var w = String(t).trim().split(/\s+/);
      if (!/^\d+\.\d+\.\d+$/.test(w[0] || "") || !(+w[1] > 100000)) throw new Error("bad version.txt");
      return { v: w[0], size: +w[1], sha: /^[0-9a-f]{64}$/.test(w[2] || "") ? w[2] : "", file: true };
    }).catch(function () {
      return getText(MAN).then(function (t) {
        var v = String((JSON.parse(t) || {}).version || "");
        if (!/^\d+\.\d+\.\d+$/.test(v)) throw new Error("no version");
        return { v: v, file: false };
      });
    });
  }
  function link(text) {
    var a = document.createElement("a");
    a.href = PAGE;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = text;
    a.style.color = "#f3dc9a";
    return a;
  }
  function mb(n) { return (n / 1048576).toFixed(1); }
  // the file, as one Blob, with the progress shown; checked against the size and the SHA-256 of version.txt
  function download(info, say) {
    return fetch(HTML + "?t=" + Date.now(), { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      if (!r.body || !r.body.getReader) return r.blob();
      var rd = r.body.getReader(), parts = [], got = 0;
      function pump() {
        return rd.read().then(function (x) {
          if (x.done) return new Blob(parts, { type: "text/html" });
          parts.push(x.value);
          got += x.value.length;
          say("מוריד… " + Math.min(99, Math.floor(100 * got / info.size)) + "% (" + mb(got) + " מתוך " + mb(info.size) + " מגה־בייט)");
          return pump();
        });
      }
      return pump();
    }).then(function (blob) {
      if (blob.size !== info.size) throw new Error("size " + blob.size + " != " + info.size);
      var subtle = window.crypto && window.crypto.subtle;
      if (!info.sha || !subtle || !blob.arrayBuffer) return blob;
      return blob.arrayBuffer().then(function (buf) { return subtle.digest("SHA-256", buf); }).then(function (h) {
        var hex = Array.prototype.map.call(new Uint8Array(h), function (b) { return (b < 16 ? "0" : "") + b.toString(16); }).join("");
        if (hex !== info.sha) throw new Error("sha");
        return blob;
      });
    });
  }
  function build(panel) {
    var box = document.createElement("div");
    box.id = "tm-upd";
    box.style.cssText = "margin:12px 0 4px;padding-top:8px;border-top:1px solid rgba(201,168,76,.3)";
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = "בדיקת עדכונים";
    b.title = "בודק ב־GitHub אם פורסמה גרסה חדשה של הקובץ";
    b.style.cssText = BTN;
    var out = document.createElement("div");
    out.style.cssText = "font-size:12px;color:#b9ac82;margin-top:6px;line-height:1.5";
    out.textContent = "הגרסה שלפניך: " + VER;
    var busy = false;
    function say(t) { out.textContent = t; }
    function offer(info) {
      out.textContent = "";
      out.appendChild(document.createTextNode("יש גרסה חדשה: " + info.v + " (לפניך " + VER + ")."));
      if (!info.file) {
        out.appendChild(document.createTextNode(" "));
        out.appendChild(link("להורדה מדף התוסף ב־GitHub"));
        return;
      }
      var d = document.createElement("button");
      d.type = "button";
      d.id = "tm-upd-get";
      d.textContent = "הורדת הגרסה החדשה ושמירה";
      d.title = "מוריד את הקובץ החדש (" + mb(info.size) + " מגה־בייט) ושואל היכן לשמור אותו";
      d.style.cssText = BTN + ";margin-top:6px;background:rgba(201,168,76,.22);font-weight:600";
      d.addEventListener("click", function () { save(info, d); });
      box.appendChild(d);
    }
    function failed(e) {
      out.textContent = "ההורדה לא הצליחה" + (e && /size|sha/.test(String(e.message)) ? " (הקובץ הגיע חסר או פגום, ולא נשמר)" : " (אין חיבור לרשת, או שהאתר אינו זמין)") + ". אפשר לנסות שוב, או ";
      out.appendChild(link("להוריד מדף התוסף ב־GitHub"));
      out.appendChild(document.createTextNode("."));
    }
    function save(info, d) {
      if (busy) return;
      busy = true;
      d.disabled = true;
      var picker = Promise.resolve(null);
      // called in the click itself: the browser opens its "save as" dialog only in answer to a click
      if (typeof window.showSaveFilePicker === "function") {
        try { picker = window.showSaveFilePicker({ suggestedName: fileName(info.v), types: [{ description: "דף אינטרנט (HTML)", accept: { "text/html": [".html", ".htm"] } }] }); }
        catch (e) { picker = Promise.reject(e); }
      }
      Promise.resolve(picker).catch(function (e) {
        if (e && e.name === "AbortError") throw e;   // the reader closed the dialog
        return null;                                 // no dialog here (a refused frame, an old browser): an ordinary download
      }).then(function (handle) {
        say("מוריד…");
        return download(info, say).then(function (blob) {
          if (handle) {
            return handle.createWritable().then(function (w) {
              return w.write(blob).then(function () { return w.close(); });
            }).then(function () {
              say("נשמר: «" + handle.name + "». כדי לראות את הגרסה החדשה — סגור את הדף הזה ופתח את הקובץ שנשמר.");
            });
          }
          var u = URL.createObjectURL(blob), a = document.createElement("a");
          a.href = u;
          a.download = fileName(info.v);
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 60000);
          say("הקובץ החדש ירד — בדרך כלל לתיקיית ההורדות. כדי לראות את הגרסה החדשה — סגור את הדף הזה ופתח את הקובץ שירד.");
        });
      }).catch(function (e) {
        if (e && e.name === "AbortError") { say("השמירה בוטלה. הגרסה החדשה: " + info.v + "."); d.disabled = false; return; }
        failed(e);
        d.disabled = false;
      }).then(function () { busy = false; });
    }
    b.addEventListener("click", function () {
      if (busy) return;
      b.disabled = true;
      var old = document.getElementById("tm-upd-get");
      if (old) old.remove();
      say("בודק…");
      latest().then(function (info) {
        if (cmp(info.v, VER) > 0) offer(info);
        else say("הגרסה שלפניך (" + VER + ") היא העדכנית.");
      }).catch(function () {
        say("הבדיקה לא הצליחה: אין חיבור לרשת, או שהאתר אינו זמין. הגרסה שלפניך: " + VER);
      }).then(function () { b.disabled = false; });
    });
    box.appendChild(b);
    box.appendChild(out);
    panel.appendChild(box);
  }
  // the menu is built by the house's own code; the button is put at its end once the house is ready, and put back if the menu is rebuilt
  setInterval(function () {
    var p = document.getElementById("tm-panel");
    if (!p || !document.documentElement.classList.contains("tm-ready")) return;
    var box = document.getElementById("tm-upd");
    if (!box) build(p);
    else if (p.lastElementChild !== box) p.appendChild(box);
  }, 1500);
})();
