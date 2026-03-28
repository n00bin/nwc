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
  var allReplies = {};  // keyed by report_id
  var votedIds = JSON.parse(localStorage.getItem("nwc_voted_reports") || "[]");
  var voterHash = generateVoterHash();
  var submitCooldown = false;
  var replyCooldown = false;
  var adminMode = false;
  var adminPass = "";

  // ---- DOM refs ----
  var filterCategory = document.getElementById("filter-category");
  var filterStatus   = document.getElementById("filter-status");
  var filterSort     = document.getElementById("filter-sort");
  var reportsCount   = document.getElementById("reports-count");
  var reportsList    = document.getElementById("reports-list");
  var submitForm     = document.getElementById("submit-form");
  var submitBtn      = document.getElementById("submit-btn");
  var formMsg        = document.getElementById("form-msg");
  var adminToggle    = document.getElementById("admin-toggle");

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

    var results = await Promise.all([
      sb.from("reports_public").select("*").order(sortCol, { ascending: false }),
      sb.from("report_replies_public").select("*").order("created_at", { ascending: true })
    ]);

    if (results[0].error) {
      reportsList.innerHTML = '<div class="empty-state">Failed to load reports. Please try again later.</div>';
      console.error("Supabase error:", results[0].error);
      return;
    }

    allReports = results[0].data || [];

    // Group replies by report_id
    allReplies = {};
    var replyData = results[1].data || [];
    for (var i = 0; i < replyData.length; i++) {
      var rid = replyData[i].report_id;
      if (!allReplies[rid]) allReplies[rid] = [];
      allReplies[rid].push(replyData[i]);
    }

    renderReports();
  }

  // ---- Render reports ----
  var resolvedExpanded = false;

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

    // Split into active and resolved
    var active = [];
    var resolved = [];
    for (var i = 0; i < filtered.length; i++) {
      var s = filtered[i].status;
      if (s === "Fixed" || s === "Won't Fix") {
        resolved.push(filtered[i]);
      } else {
        active.push(filtered[i]);
      }
    }

    // Sort active: status priority (New > Confirmed > In Progress), then by upvotes
    var statusOrder = { "In Progress": 0, "New": 1, "Confirmed": 2 };
    active.sort(function (a, b) {
      var sa = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 9;
      var sb = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 9;
      if (sa !== sb) return sa - sb;
      return b.upvotes - a.upvotes;
    });

    // Sort resolved: newest first
    resolved.sort(function (a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    var html = "";

    // Active section
    if (active.length > 0) {
      html += '<div class="reports-section-header">Active (' + active.length + ')</div>';
      for (var j = 0; j < active.length; j++) {
        html += buildReportCard(active[j]);
      }
    }

    // Resolved section (collapsed by default)
    if (resolved.length > 0) {
      html += '<div class="reports-section-header resolved-toggle" id="resolved-toggle">';
      html += (resolvedExpanded ? '&#9660;' : '&#9654;') + ' Resolved (' + resolved.length + ')';
      html += '</div>';
      if (resolvedExpanded) {
        for (var k = 0; k < resolved.length; k++) {
          html += buildReportCard(resolved[k]);
        }
      }
    }

    if (active.length === 0 && resolved.length === 0) {
      html = '<div class="empty-state">No reports found</div>';
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

    var isResolved = r.status === "Fixed" || r.status === "Won't Fix";
    var html = '<div class="report-card">';

    // Vote column
    html += '<div class="vote-col">';
    if (isResolved) {
      html += '<span class="vote-btn voted" style="opacity:0.3;cursor:default;" title="Resolved">&#9650;</span>';
    } else {
      html += '<button class="vote-btn' + votedClass + '" data-id="' + r.id + '" title="' + (hasVoted ? "Already voted" : "Upvote this report") + '">';
      html += "&#9650;";
      html += "</button>";
    }
    html += '<span class="vote-count">' + r.upvotes + "</span>";
    html += "</div>";

    // Content
    html += '<div class="report-content">';
    html += '<div class="report-title"><span style="color:var(--text-muted);font-weight:400;font-size:0.85em;margin-right:0.4rem;">#' + r.id + '</span>' + escapeHtml(r.title) + "</div>";
    html += '<div class="report-desc">' + escapeHtml(r.description) + "</div>";
    html += '<div class="report-meta">';
    html += catBadge + " ";
    // Admin mode: show status dropdown instead of badge
    if (adminMode) {
      var statuses = ["New", "Confirmed", "In Progress", "Fixed", "Won't Fix"];
      html += '<select class="status-select" data-id="' + r.id + '">';
      for (var si = 0; si < statuses.length; si++) {
        var sel = statuses[si] === r.status ? " selected" : "";
        html += '<option value="' + escapeHtml(statuses[si]) + '"' + sel + '>' + escapeHtml(statuses[si]) + "</option>";
      }
      html += "</select>";
      html += ' <button class="delete-btn" data-id="' + r.id + '" title="Delete this report">&#10005;</button>';
    } else {
      html += statusBadge;
    }
    html += '<span>' + dateStr + "</span>";
    html += "</div>";
    // Image
    if (r.image_url) {
      html += '<a href="' + escapeHtml(r.image_url) + '" target="_blank"><img class="report-img" src="' + escapeHtml(r.image_url) + '" alt="Report screenshot"></a>';
    }
    // Admin note (visible to all, editable in admin mode)
    if (r.admin_notes) {
      html += '<div class="admin-note"><span class="admin-note-label">Admin:</span> ' + escapeHtml(r.admin_notes) + '</div>';
    }
    if (adminMode) {
      html += '<div style="margin-top:0.4rem;">';
      html += '<input type="text" class="form-input note-input" data-id="' + r.id + '" placeholder="Add admin note..." value="' + escapeHtml(r.admin_notes || "") + '" style="font-size:0.8rem;padding:0.3rem 0.5rem;">';
      html += ' <button class="note-save-btn" data-id="' + r.id + '" style="font-size:0.78rem;padding:0.2rem 0.5rem;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-sm);cursor:pointer;">Save Note</button>';
      html += '</div>';
    }
    // Replies section (only when admin note exists)
    if (r.admin_notes) {
      var replies = allReplies[r.id] || [];
      html += '<div class="replies-section">';
      if (replies.length > 0) {
        for (var ri = 0; ri < replies.length; ri++) {
          var rp = replies[ri];
          var rpDate = new Date(rp.created_at);
          var rpDateStr = rpDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
          html += '<div class="reply-card">';
          html += '<div class="reply-msg">' + escapeHtml(rp.message) + '</div>';
          if (rp.image_url) {
            html += '<a href="' + escapeHtml(rp.image_url) + '" target="_blank"><img class="reply-img" src="' + escapeHtml(rp.image_url) + '" alt="Reply image"></a>';
          }
          html += '<div class="reply-meta">' + rpDateStr;
          if (adminMode) {
            html += ' <button class="delete-btn reply-delete-btn" data-reply-id="' + rp.id + '" title="Delete reply">&#10005;</button>';
          }
          html += '</div>';
          html += '</div>';
        }
      }
      // Reply form (only if not resolved)
      if (!isResolved) {
        html += '<div class="reply-form" data-report-id="' + r.id + '">';
        html += '<textarea class="reply-text" placeholder="Help with this report..." maxlength="1000"></textarea>';
        html += '<div class="reply-form-actions">';
        html += '<input type="file" class="reply-image-input" accept="image/jpeg,image/png,image/gif,image/webp" style="font-size:0.78rem;max-width:200px;">';
        html += '<button class="reply-submit-btn">Reply</button>';
        html += '</div>';
        html += '<div class="reply-msg-feedback"></div>';
        html += '</div>';
      }
      html += '</div>';
    }
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

    // Upload image if provided
    var imageUrl = "";
    var imageFile = document.getElementById("report-image").files[0];
    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        formMsg.textContent = "Image must be under 5MB.";
        formMsg.className = "form-msg error";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Report";
        return;
      }
      var fileName = Date.now() + "_" + imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "");
      var { data: uploadData, error: uploadError } = await sb.storage
        .from("report-images")
        .upload(fileName, imageFile);
      if (uploadError) {
        formMsg.textContent = "Image upload failed: " + uploadError.message;
        formMsg.className = "form-msg error";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Report";
        return;
      }
      var { data: urlData } = sb.storage.from("report-images").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    var { error } = await sb.from("reports").insert({
      title: title,
      description: description,
      category: category,
      image_url: imageUrl
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

  // ---- Resolved toggle ----
  reportsList.addEventListener("click", function (e) {
    var toggle = e.target.closest(".resolved-toggle");
    if (!toggle) return;
    resolvedExpanded = !resolvedExpanded;
    renderReports();
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

  // ---- Admin toggle ----
  adminToggle.addEventListener("click", async function () {
    if (adminMode) {
      // Turn off admin mode
      adminMode = false;
      adminPass = "";
      adminToggle.classList.remove("active");
      adminToggle.textContent = "Admin";
      renderReports();
    } else {
      // Prompt for password
      var pass = prompt("Enter admin password:");
      if (!pass) return;

      // Verify password immediately by calling update with a non-existent report
      // If password is wrong: returns {success: false, reason: "unauthorized"}
      // If password is right: returns {success: false, reason: "not_found"} (report 0 doesn't exist)
      adminToggle.textContent = "Checking...";
      adminToggle.disabled = true;

      var { data, error } = await sb.rpc("update_report_status", {
        report_id: 0,
        new_status: "New",
        admin_pass: pass
      });

      adminToggle.disabled = false;

      if (error || (data && data.reason === "unauthorized")) {
        adminToggle.textContent = "Admin";
        alert("Wrong password.");
        return;
      }

      // Password verified (got "not_found" which means it passed the password check)
      adminPass = pass;
      adminMode = true;
      adminToggle.classList.add("active");
      adminToggle.textContent = "Admin (on)";
      renderReports();
    }
  });

  // ---- Admin status change ----
  reportsList.addEventListener("change", async function (e) {
    var select = e.target.closest(".status-select");
    if (!select || !adminMode) return;

    var id = parseInt(select.getAttribute("data-id"), 10);
    var newStatus = select.value;

    select.disabled = true;

    var { data, error } = await sb.rpc("update_report_status", {
      report_id: id,
      new_status: newStatus,
      admin_pass: adminPass
    });

    if (error) {
      alert("Failed to update status. Check console for details.");
      console.error("Status update error:", error);
      select.disabled = false;
      return;
    }

    if (data && data.success) {
      // Update local data
      for (var i = 0; i < allReports.length; i++) {
        if (allReports[i].id === id) {
          allReports[i].status = newStatus;
          break;
        }
      }
      select.disabled = false;
    } else if (data && data.reason === "unauthorized") {
      alert("Wrong password. Admin mode disabled.");
      adminMode = false;
      adminPass = "";
      adminToggle.classList.remove("active");
      adminToggle.textContent = "Admin";
      renderReports();
    } else {
      alert("Failed: " + (data ? data.reason : "unknown error"));
      select.disabled = false;
    }
  });

  // ---- Admin delete ----
  reportsList.addEventListener("click", async function (e) {
    var btn = e.target.closest(".delete-btn");
    if (!btn || !adminMode) return;

    var id = parseInt(btn.getAttribute("data-id"), 10);
    if (!confirm("Delete this report? This cannot be undone.")) return;

    btn.disabled = true;
    btn.textContent = "...";

    var { data, error } = await sb.rpc("delete_report", {
      report_id: id,
      admin_pass: adminPass
    });

    if (error) {
      alert("Failed to delete. Check console for details.");
      console.error("Delete error:", error);
      btn.disabled = false;
      btn.textContent = "\u2715";
      return;
    }

    if (data && data.success) {
      allReports = allReports.filter(function (r) { return r.id !== id; });
      renderReports();
    } else if (data && data.reason === "unauthorized") {
      alert("Wrong password. Admin mode disabled.");
      adminMode = false;
      adminPass = "";
      adminToggle.classList.remove("active");
      adminToggle.textContent = "Admin";
      renderReports();
    } else {
      alert("Failed: " + (data ? data.reason : "unknown error"));
      btn.disabled = false;
      btn.textContent = "\u2715";
    }
  });

  // ---- Admin note save ----
  reportsList.addEventListener("click", async function (e) {
    var btn = e.target.closest(".note-save-btn");
    if (!btn || !adminMode) return;

    var id = parseInt(btn.getAttribute("data-id"), 10);
    var input = reportsList.querySelector('.note-input[data-id="' + id + '"]');
    if (!input) return;

    var noteText = input.value.trim();
    btn.disabled = true;
    btn.textContent = "Saving...";

    var { data, error } = await sb.rpc("update_report_note", {
      report_id: id,
      note_text: noteText,
      admin_pass: adminPass
    });

    if (error) {
      alert("Failed to save note. Check console.");
      console.error("Note error:", error);
      btn.disabled = false;
      btn.textContent = "Save Note";
      return;
    }

    if (data && data.success) {
      for (var i = 0; i < allReports.length; i++) {
        if (allReports[i].id === id) {
          allReports[i].admin_notes = noteText;
          break;
        }
      }
      renderReports();
    } else if (data && data.reason === "unauthorized") {
      alert("Wrong password. Admin mode disabled.");
      adminMode = false;
      adminPass = "";
      adminToggle.classList.remove("active");
      adminToggle.textContent = "Admin";
      renderReports();
    } else {
      alert("Failed: " + (data ? data.reason : "unknown error"));
      btn.disabled = false;
      btn.textContent = "Save Note";
    }
  });

  // ---- Submit reply ----
  reportsList.addEventListener("click", async function (e) {
    var btn = e.target.closest(".reply-submit-btn");
    if (!btn) return;

    var form = btn.closest(".reply-form");
    if (!form) return;

    var reportId = parseInt(form.getAttribute("data-report-id"), 10);
    var textarea = form.querySelector(".reply-text");
    var fileInput = form.querySelector(".reply-image-input");
    var feedback = form.querySelector(".reply-msg-feedback");
    var message = textarea.value.trim();

    feedback.textContent = "";
    feedback.className = "reply-msg-feedback";

    if (replyCooldown) {
      feedback.textContent = "Please wait before submitting another reply.";
      feedback.className = "reply-msg-feedback error";
      return;
    }

    if (message.length < 5) {
      feedback.textContent = "Reply must be at least 5 characters.";
      feedback.className = "reply-msg-feedback error";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Submitting...";

    // Upload image if provided
    var imageUrl = "";
    var imageFile = fileInput && fileInput.files[0];
    if (imageFile) {
      if (imageFile.size > 5 * 1024 * 1024) {
        feedback.textContent = "Image must be under 5MB.";
        feedback.className = "reply-msg-feedback error";
        btn.disabled = false;
        btn.textContent = "Reply";
        return;
      }
      var fileName = Date.now() + "_reply_" + imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "");
      var uploadResult = await sb.storage.from("report-images").upload(fileName, imageFile);
      if (uploadResult.error) {
        feedback.textContent = "Image upload failed: " + uploadResult.error.message;
        feedback.className = "reply-msg-feedback error";
        btn.disabled = false;
        btn.textContent = "Reply";
        return;
      }
      var urlResult = sb.storage.from("report-images").getPublicUrl(fileName);
      imageUrl = urlResult.data.publicUrl;
    }

    var { data, error } = await sb.rpc("submit_report_reply", {
      p_report_id: reportId,
      p_message: message,
      p_image_url: imageUrl
    });

    if (error) {
      feedback.textContent = "Failed to submit reply.";
      feedback.className = "reply-msg-feedback error";
      console.error("Reply error:", error);
      btn.disabled = false;
      btn.textContent = "Reply";
      return;
    }

    if (data && data.success) {
      feedback.textContent = "Reply submitted!";
      feedback.className = "reply-msg-feedback success";
      textarea.value = "";
      if (fileInput) fileInput.value = "";

      replyCooldown = true;
      btn.disabled = true;
      btn.textContent = "Please wait...";
      setTimeout(function () {
        replyCooldown = false;
        btn.disabled = false;
        btn.textContent = "Reply";
      }, 15000);

      fetchReports();
    } else {
      feedback.textContent = "Failed: " + (data ? data.reason : "unknown error");
      feedback.className = "reply-msg-feedback error";
      btn.disabled = false;
      btn.textContent = "Reply";
    }
  });

  // ---- Admin delete reply ----
  reportsList.addEventListener("click", async function (e) {
    var btn = e.target.closest(".reply-delete-btn");
    if (!btn || !adminMode) return;

    var replyId = parseInt(btn.getAttribute("data-reply-id"), 10);
    if (!confirm("Delete this reply?")) return;

    btn.disabled = true;

    var { data, error } = await sb.rpc("delete_report_reply", {
      reply_id: replyId,
      admin_pass: adminPass
    });

    if (error || !data || !data.success) {
      alert("Failed to delete reply.");
      btn.disabled = false;
      return;
    }

    fetchReports();
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
