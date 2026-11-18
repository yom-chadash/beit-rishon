      // OPS_GROUPS_303 (the user, 18.11.2026: "שימת המחלוקות מאוד ארוכה, הייתי מציע לחלק אותה לקטגוריות כגון <הר הבית> <עזרת נשים>
      // <לשכות העזרה> <המזבח> וכו'. ע"י כך זה יהיה מסודר יותר ויהיה קל יותר לשימוש"; on the groups proposed: "החלוקה מצוינת תתחיל
      // לעבוד עליה"; a numbering of סימנים and סעיפים: "לא מעניין - בשביל זה יש חיפוש"): THE TABLE IN GROUPS BY PLACE, from outside in.
      // Each group is a closed <details> inside #tm-ops, its title with the number of its rows; inside a group the rows of one place
      // stand together (the order of one walk, 1.3.5). OPS (the readings of the presentation, 75-tour.js) goes by the same order, and
      // every row knows its group (row.group - the line above a reading's slide). A row that no group lists (one added later) is not
      // lost: it stands after the groups, in "עוד". A row of a card only (row.cardOnly) keeps its place in OPS and is not counted.
      {
        const GROUPS = /*GROUPS*/;
        const byId = {};
        for (const r of OPS) if (r && r.id && !byId[r.id]) byId[r.id] = r;
        const used = new Set();
        const lists = [];
        for (const [name, ids] of GROUPS) {
          const rows = [];
          for (const id of ids) {
            const r = byId[id];
            if (r && !used.has(r)) { used.add(r); rows.push(r); }
          }
          if (rows.length) lists.push([name, rows]);
        }
        const rest = OPS.filter((r) => r && !used.has(r));
        if (rest.length) lists.push(["עוד", rest]);
        OPS.length = 0;
        for (const [name, rows] of lists) {
          const det = document.createElement("details");
          det.className = "tm-opg";
          const body = document.createElement("div");
          body.className = "tm-opg-b";
          let n = 0;
          for (const r of rows) {
            OPS.push(r);
            r.group = name;
            if (r.box && !r.cardOnly) { body.appendChild(r.box); n++; }
          }
          if (!n) continue;   // a group of card rows only: no empty group in the table
          const sm = document.createElement("summary");
          sm.textContent = name;
          const cnt = document.createElement("span");
          cnt.className = "n";
          cnt.textContent = "(" + n + ")";
          sm.appendChild(cnt);
          det.appendChild(sm);
          det.appendChild(body);
          opsBox.appendChild(det);
        }
      }
