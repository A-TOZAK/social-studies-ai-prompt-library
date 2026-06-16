(function () {
  "use strict";

  const prompts = Array.isArray(window.PROMPTS) ? window.PROMPTS : [];
  const resources = Array.isArray(window.RESOURCES) ? window.RESOURCES : [];
  const validationNotes = window.GEMINI_VALIDATION_NOTES || {};
  const likeKey = "socialStudiesAiPromptLikes.v1";
  const draftKey = "socialStudiesAiPromptDrafts.v1";

  const labels = {
    all: "すべて",
    inquiry: "問い",
    prep: "授業準備",
    feedback: "見取り・FB",
    dialogue: "対話",
    self: "自己調整",
    student: "児童用",
    share: "共有"
  };

  const state = {
    category: "all",
    query: "",
    likedOnly: false,
    currentId: null,
    likes: readStore(likeKey),
    drafts: readStore(draftKey),
    validations: {}
  };

  const grid = document.getElementById("promptGrid");
  const count = document.getElementById("promptCount");
  const search = document.getElementById("promptSearch");
  const filters = document.getElementById("categoryFilters");
  const toast = document.getElementById("toast");
  const dialog = document.getElementById("promptDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogMeta = document.getElementById("dialogMeta");
  const dialogBenefit = document.getElementById("dialogBenefit");
  const promptEditor = document.getElementById("promptEditor");
  const customizeList = document.getElementById("customizeList");
  const resourceList = document.getElementById("resourceList");
  const likedToggle = document.getElementById("showLikedOnly");
  const validationSummary = document.getElementById("validationSummary");
  const validationGrid = document.getElementById("validationGrid");
  const dialogValidation = document.getElementById("dialogValidation");

  function readStore(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "{}");
      return value && typeof value === "object" ? value : {};
    } catch (error) {
      return {};
    }
  }

  function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalize(value) {
    return String(value || "").normalize("NFKC").toLowerCase();
  }

  function truncate(value, length) {
    const text = String(value || "").trim();
    return text.length > length ? `${text.slice(0, length)}...` : text;
  }

  function getValidation(id) {
    return state.validations[id] || validationNotes[id] || null;
  }

  function verdictClass(verdict) {
    if (verdict === "良好") return "is-good";
    if (verdict === "軽微修正") return "is-minor";
    if (verdict === "要修正") return "is-fix";
    return "is-tested";
  }

  function validationBadge(validation) {
    if (!validation) return "";
    const label = validation.verdict || "検証済み";
    return `<span class="validation-badge ${verdictClass(label)}">Gemini ${escapeHtml(label)}</span>`;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  async function copyText(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message || "コピーしました");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      showToast(message || "コピーしました");
    }
  }

  function findPrompt(id) {
    return prompts.find(function (prompt) {
      return prompt.id === id;
    });
  }

  function getPromptText(prompt) {
    return state.drafts[prompt.id] || prompt.body;
  }

  function isLiked(id) {
    return Boolean(state.likes[id]);
  }

  function formatPromptMeta(prompt) {
    const category = labels[prompt.category] || "";
    if (!prompt.phase) return category;
    return prompt.phase === category || prompt.phase.indexOf(`${category} /`) === 0
      ? prompt.phase
      : `${category} / ${prompt.phase}`;
  }

  function likedCount() {
    return prompts.filter(function (prompt) {
      return isLiked(prompt.id);
    }).length;
  }

  function getVisiblePrompts() {
    const query = normalize(state.query);
    return prompts.filter(function (prompt) {
      const categoryMatch = state.category === "all" || prompt.category === state.category;
      const likedMatch = !state.likedOnly || isLiked(prompt.id);
      const haystack = normalize([
        prompt.title,
        prompt.summary,
        prompt.benefit,
        prompt.phase,
        prompt.tags.join(" "),
        prompt.body
      ].join(" "));
      return categoryMatch && likedMatch && (!query || haystack.includes(query));
    });
  }

  function renderPrompts() {
    const visible = getVisiblePrompts();
    count.textContent = `${visible.length}件表示 / ${prompts.length}件中・いいね ${likedCount()}件`;

    if (!visible.length) {
      grid.innerHTML = '<p class="empty-state">該当するプロンプトがありません。検索語を短くするか、カテゴリを戻してください。</p>';
      return;
    }

    grid.innerHTML = visible.map(function (prompt) {
      const liked = isLiked(prompt.id);
      const edited = Boolean(state.drafts[prompt.id]);
      const validation = getValidation(prompt.id);
      return `
        <article class="prompt-card ${liked ? "is-liked" : ""}" data-id="${escapeHtml(prompt.id)}">
          <div class="prompt-card-top">
            <span class="category-pill">${escapeHtml(labels[prompt.category])}</span>
            <span class="phase">${escapeHtml(prompt.phase)}</span>
          </div>
          <h3>${escapeHtml(prompt.title)}</h3>
          <p class="summary">${escapeHtml(prompt.summary)}</p>
          <p class="benefit"><span>メリット</span>${escapeHtml(prompt.benefit)}</p>
          ${validation ? `
            <div class="validation-mini">
              ${validationBadge(validation)}
              <p>${escapeHtml(validation.summary || "Gemini Flashで実機検証済みです。")}</p>
            </div>
          ` : ""}
          <div class="tag-list">${prompt.tags.map(function (tag) {
            return `<span>${escapeHtml(tag)}</span>`;
          }).join("")}</div>
          <div class="card-actions">
            <button type="button" data-copy="${escapeHtml(prompt.id)}">コピー</button>
            <button type="button" data-edit="${escapeHtml(prompt.id)}">${edited ? "編集版" : "編集"}</button>
            <button type="button" class="like-button" data-like="${escapeHtml(prompt.id)}" aria-pressed="${liked ? "true" : "false"}">${liked ? "いいね済" : "いいね"}</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderResources() {
    resourceList.innerHTML = resources.map(function (resource) {
      return `
        <a class="resource-row" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener">
          <span>${escapeHtml(resource.type)}</span>
          <strong>${escapeHtml(resource.title)}</strong>
          <em>${escapeHtml(resource.description)}</em>
        </a>
      `;
    }).join("");
  }

  function openEditor(id) {
    const prompt = findPrompt(id);
    if (!prompt) return;
    const validation = getValidation(id);
    state.currentId = id;
    dialogTitle.textContent = prompt.title;
    dialogMeta.textContent = formatPromptMeta(prompt);
    dialogBenefit.textContent = prompt.benefit;
    promptEditor.value = getPromptText(prompt);
    customizeList.innerHTML = prompt.customize.map(function (item) {
      return `<li>${escapeHtml(item)}</li>`;
    }).join("");
    renderDialogValidation(validation);

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      promptEditor.focus();
    } else {
      dialog.setAttribute("open", "");
      promptEditor.focus();
    }
  }

  function copyLikedList() {
    const liked = prompts.filter(function (prompt) {
      return isLiked(prompt.id);
    });

    if (!liked.length) {
      showToast("いいねしたプロンプトがまだありません");
      return;
    }

    const text = liked.map(function (prompt, index) {
      return `${index + 1}. ${prompt.title}（${formatPromptMeta(prompt)}）`;
    }).join("\n");
    copyText(text, "いいね一覧をコピーしました");
  }

  function renderDialogValidation(validation) {
    if (!dialogValidation || !validation) {
      if (dialogValidation) {
        dialogValidation.hidden = true;
        dialogValidation.innerHTML = "";
      }
      return;
    }

    dialogValidation.hidden = false;
    dialogValidation.innerHTML = `
      <h3>Gemini検証メモ</h3>
      <div class="validation-detail-head">
        ${validationBadge(validation)}
        ${validation.answerChars ? `<span>${escapeHtml(validation.answerChars)}字</span>` : ""}
      </div>
      <dl>
        <div><dt>出力概要</dt><dd>${escapeHtml(validation.summary || "")}</dd></div>
        <div><dt>良かった点</dt><dd>${escapeHtml(validation.strength || "")}</dd></div>
        <div><dt>注意点</dt><dd>${escapeHtml(validation.concern || "")}</dd></div>
        <div><dt>反映方針</dt><dd>${escapeHtml(validation.revision || "")}</dd></div>
      </dl>
      ${validation.answerPreview ? `
        <details>
          <summary>Gemini出力プレビュー</summary>
          <pre>${escapeHtml(truncate(validation.answerPreview, 1200))}</pre>
        </details>
      ` : ""}
    `;
  }

  function renderValidationSection() {
    if (!validationSummary || !validationGrid) return;

    const validations = prompts.map(function (prompt) {
      return {
        prompt: prompt,
        validation: getValidation(prompt.id)
      };
    }).filter(function (item) {
      return item.validation;
    });

    if (!validations.length) {
      validationSummary.innerHTML = "<p>検証結果を読み込み中です。</p>";
      validationGrid.innerHTML = "";
      return;
    }

    const counts = validations.reduce(function (memo, item) {
      const verdict = item.validation.verdict || "検証済み";
      memo[verdict] = (memo[verdict] || 0) + 1;
      return memo;
    }, {});
    const rawCount = validations.filter(function (item) {
      return item.validation.answerPreview;
    }).length;
    const averageChars = Math.round(validations.reduce(function (sum, item) {
      return sum + (Number(item.validation.answerChars) || 0);
    }, 0) / Math.max(rawCount, 1));

    validationSummary.innerHTML = `
      <article>
        <strong>${validations.length}本</strong>
        <span>プロンプト検証済み</span>
      </article>
      <article>
        <strong>${counts["良好"] || 0}本</strong>
        <span>そのまま使いやすい</span>
      </article>
      <article>
        <strong>${(counts["軽微修正"] || 0) + (counts["要修正"] || 0)}本</strong>
        <span>条件追加が有効</span>
      </article>
      <article>
        <strong>${averageChars.toLocaleString()}字</strong>
        <span>平均出力量の目安</span>
      </article>
    `;

    validationGrid.innerHTML = validations.map(function (item) {
      const prompt = item.prompt;
      const validation = item.validation;
      return `
        <article class="validation-card">
          <div class="validation-card-head">
            ${validationBadge(validation)}
            <span>${escapeHtml(formatPromptMeta(prompt))}</span>
          </div>
          <h3>${escapeHtml(prompt.title)}</h3>
          <p>${escapeHtml(validation.summary || "")}</p>
          <dl>
            <div><dt>良かった点</dt><dd>${escapeHtml(validation.strength || "")}</dd></div>
            <div><dt>注意点</dt><dd>${escapeHtml(validation.concern || "")}</dd></div>
            <div><dt>反映方針</dt><dd>${escapeHtml(validation.revision || "")}</dd></div>
          </dl>
          ${validation.answerPreview ? `
            <details>
              <summary>出力プレビューを見る${validation.answerChars ? `（${escapeHtml(validation.answerChars)}字）` : ""}</summary>
              <pre>${escapeHtml(truncate(validation.answerPreview, 900))}</pre>
            </details>
          ` : ""}
        </article>
      `;
    }).join("");
  }

  async function loadValidationResults() {
    Object.keys(validationNotes).forEach(function (id) {
      state.validations[id] = validationNotes[id];
    });
    renderPrompts();
    renderValidationSection();

    try {
      const response = await fetch("docs/gemini-flash-validation-raw-results.json", { cache: "no-store" });
      if (!response.ok) throw new Error("validation fetch failed");
      const raw = await response.json();
      if (!Array.isArray(raw)) return;

      raw.forEach(function (item) {
        if (!item || !item.id) return;
        state.validations[item.id] = Object.assign({}, validationNotes[item.id] || {}, {
          index: item.index,
          status: item.status,
          answerChars: item.answerChars,
          answerPreview: item.answerPreview
        });
      });
      renderPrompts();
      renderValidationSection();
    } catch (error) {
      renderPrompts();
      renderValidationSection();
    }
  }

  filters.addEventListener("click", function (event) {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    state.category = button.dataset.category;
    filters.querySelectorAll("[data-category]").forEach(function (item) {
      const active = item.dataset.category === state.category;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });
    renderPrompts();
  });

  search.addEventListener("input", function () {
    state.query = search.value;
    renderPrompts();
  });

  grid.addEventListener("click", function (event) {
    const copyButton = event.target.closest("[data-copy]");
    const editButton = event.target.closest("[data-edit]");
    const likeButton = event.target.closest("[data-like]");

    if (copyButton) {
      const prompt = findPrompt(copyButton.dataset.copy);
      if (prompt) copyText(getPromptText(prompt), "プロンプトをコピーしました");
    }

    if (editButton) {
      openEditor(editButton.dataset.edit);
    }

    if (likeButton) {
      const id = likeButton.dataset.like;
      if (state.likes[id]) {
        delete state.likes[id];
        showToast("いいねを外しました");
      } else {
        state.likes[id] = new Date().toISOString();
        showToast("いいねしました");
      }
      writeStore(likeKey, state.likes);
      renderPrompts();
    }
  });

  likedToggle.addEventListener("click", function () {
    state.likedOnly = !state.likedOnly;
    likedToggle.classList.toggle("is-active", state.likedOnly);
    likedToggle.setAttribute("aria-pressed", state.likedOnly ? "true" : "false");
    renderPrompts();
  });

  document.getElementById("copyLiked").addEventListener("click", copyLikedList);
  document.getElementById("copyLikedBottom").addEventListener("click", copyLikedList);

  document.getElementById("copyEdited").addEventListener("click", function () {
    copyText(promptEditor.value, "編集版をコピーしました");
  });

  document.getElementById("saveDraft").addEventListener("click", function () {
    const prompt = findPrompt(state.currentId);
    if (!prompt) return;
    const edited = promptEditor.value.trim();
    if (!edited || edited === prompt.body.trim()) {
      delete state.drafts[prompt.id];
      showToast("編集版を解除しました");
    } else {
      state.drafts[prompt.id] = promptEditor.value;
      showToast("この端末に保存しました");
    }
    writeStore(draftKey, state.drafts);
    renderPrompts();
  });

  document.getElementById("resetPrompt").addEventListener("click", function () {
    const prompt = findPrompt(state.currentId);
    if (!prompt) return;
    promptEditor.value = prompt.body;
    delete state.drafts[prompt.id];
    writeStore(draftKey, state.drafts);
    renderPrompts();
    showToast("元のプロンプトに戻しました");
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  renderResources();
  renderPrompts();
  renderValidationSection();
  loadValidationResults();
})();
