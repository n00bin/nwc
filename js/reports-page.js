/* ============================================================
   NWC Reports Page
   ============================================================ */

(function () {
  // ---- Supabase client ----
  var SUPABASE_URL  = "https://ynrfmmccarrpqjdrpvqn.supabase.co";
  var SUPABASE_ANON = "sb_publishable_RSK4LJnJ4-HQDudcRq3gRw_WJI5WIUw";
  var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // ---- State ----
  var allReports = [];
  var votedIds = JSON.parse(localStorage.getItem("nwc_voted_reports") || "[]");
  var voterHash = generateVoterHash();
  var submitCooldown = false;

  // ---- DOM refs ----
  var filterCategory = document.getElementById("filter-category");
  var filterStatus   = document.getElementById("filter-status");
  var filterSort     = document.getElementById("filter-sort");
  var reportsCount   = document.getElementById("reports-count");
  var reportsList    = document.getElementById("reports-list");
  var submitForm     = document.getElementById("submit-form");
  var submitBtn      = document.getElementById("submit-btn");
  var formMsg        = document.getElementById("form-msg");

  // ---- Init nav ----
  renderNav("Reports");

  // ---- Voter fingerprint hash ----
  function generateVoterHash() {
    var raw = [
      navigator.userAgent,
      screen.width + "x" + screen.height,
      navigator.language,
      new Date().getTimezoneOffset()
    ].join("|");

    var hash = 5381;
    for (var i = 0; i < raw.length; i++) {
      hash = ((hash << 5) + hash) + raw.charCodeAt(i);
      hash = hash & hash;
    }
    return "v1_" + Math.abs(hash).toString(36);
  }

  // ---- Fetch reports ----
  async function fetchReports() {
    var sortCol = filterSort.value === "most_voted" ? "upvotes" : "created_at";

    var { data, error } = await sb
      .from("reports_public")
      .select("*")
      .order(sortCol, { ascending: false });

    if (error) {
      reportsList.innerHTML = '<div class="empty-state">Failed to load reports. Please try again later.</div>';
      console.error("Supabase error:", error);
      return;
    }

    allReports = data || [];
    renderReports();
  }

  // ---- Render reports ----
  function renderReports() {
    var catVal    = filterCategory.value;
    var statusVal = filterStatus.value;

    var filtered = allReports.filter(function (r) {
      if (catVal && r.category !== catVal) return false;
      if (statusVal && r.status !== statusVal) return false;
      return true;
    });

    reportsCount.textContent = filtered.length + " of " + allReports.length + " reports";

    if (filtered.length === 0) {
      reportsList.innerHTML = '<div class="empty-state">No reports found</div>';
      return;
    }

    var html = "";
    for (var i = 0; i < filtered.length; i++) {
      html += buildReportCard(filtered[i]);
    }
    reportsList.innerHTML = html;
  }

  function buildReportCard(r) {
    var hasVoted = votedIds.indexOf(r.id) !== -1;
    var votedClass = hasVoted ? " voted" : "";

    // Status badge class
    var statusSlug = r.status.toLowerCase().replace(/[' ]/g, "-");
    var statusBadge = '<span class="badge badge-status-' + statusSlug + '">' + escapeHtml(r.status) + "</span>";

    // Category badge class
    var catSlug = r.category.toLowerCase().replace(/ /g, "-");
    var catBadge = '<span class="badge badge-cat-' + catSlug + '">' + escapeHtml(r.category) + "</span>";

    // Date
    var date = new Date(r.created_at);
    var dateStr = date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

    var html = '<div class="report-card">';

    // Vote column
    html += '<div class="vote-col">';
    html += '<button class="vote-btn' + votedClass + '" data-id="' + r.id + '" title="' + (hasVoted ? "Already voted" : "Upvote this report") + '">';
    html += "&#9650;"; // triangle up
    html += "</button>";
    html += '<span class="vote-count">' + r.upvotes + "</span>";
    html += "</div>";

    // Content
    html += '<div class="report-content">';
    html += '<div class="report-title">' + escapeHtml(r.title) + "</div>";
    html += '<div class="report-desc">' + escapeHtml(r.description) + "</div>";
    html += '<div class="report-meta">';
    html += catBadge + " " + statusBadge;
    html += '<span>' + dateStr + "</span>";
    html += "</div>";
    html += "</div>";

    html += "</div>";
    return html;
  }

  // ---- Submit report ----
  submitForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    formMsg.textContent = "";
    formMsg.className = "form-msg";

    if (submitCooldown) {
      formMsg.textContent = "Please wait before submitting another report.";
      formMsg.className = "form-msg error";
      return;
    }

    var title       = document.getElementById("report-title").value.trim();
    var category    = document.getElementById("report-category").value;
    var description = document.getElementById("report-desc").value.trim();

    // Client-side validation
    if (title.length < 3) {
      formMsg.textContent = "Title must be at least 3 characters.";
      formMsg.className = "form-msg error";
      return;
    }
    if (!category) {
      formMsg.textContent = "Please select a category.";
      formMsg.className = "form-msg error";
      return;
    }
    if (description.length < 10) {
      formMsg.textContent = "Description must be at least 10 characters.";
      formMsg.className = "form-msg error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    var { error } = await sb.from("reports").insert({
      title: title,
      description: description,
      category: category
    });

    if (error) {
      formMsg.textContent = "Failed to submit. Please try again.";
      formMsg.className = "form-msg error";
      console.error("Submit error:", error);
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Report";
      return;
    }

    // Success
    formMsg.textContent = "Report submitted! Thank you.";
    formMsg.className = "form-msg success";
    submitForm.reset();

    // Cooldown: 30 seconds
    submitCooldown = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Please wait...";
    setTimeout(function () {
      submitCooldown = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Report";
    }, 30000);

    // Refresh the list
    fetchReports();
  });

  // ---- Upvote ----
  reportsList.addEventListener("click", async function (e) {
    var btn = e.target.closest(".vote-btn");
    if (!btn || btn.classList.contains("voted")) return;

    var id = parseInt(btn.getAttribute("data-id"), 10);
    if (votedIds.indexOf(id) !== -1) return;

    // Disable button while processing
    btn.classList.add("voted");

    var { data, error } = await sb.rpc("upvote_report", {
      report_id: id,
      voter_hash: voterHash
    });

    if (error) {
      btn.classList.remove("voted");
      console.error("Vote error:", error);
      return;
    }

    if (data && data.success) {
      // Record vote locally
      votedIds.push(id);
      localStorage.setItem("nwc_voted_reports", JSON.stringify(votedIds));
      // Optimistic update
      for (var i = 0; i < allReports.length; i++) {
        if (allReports[i].id === id) {
          allReports[i].upvotes++;
          break;
        }
      }
      renderReports();
    } else if (data && data.reason === "already_voted") {
      // Sync localStorage
      votedIds.push(id);
      localStorage.setItem("nwc_voted_reports", JSON.stringify(votedIds));
      renderReports();
    } else {
      btn.classList.remove("voted");
    }
  });

  // ---- Filter handlers ----
  filterCategory.addEventListener("change", renderReports);
  filterStatus.addEventListener("change", renderReports);
  filterSort.addEventListener("change", function () {
    fetchReports(); // Re-fetch with new sort order
  });

  // ---- Initial load ----
  fetchReports();
})();
