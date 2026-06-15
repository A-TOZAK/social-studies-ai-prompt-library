(function () {
  "use strict";

  const prompts = Array.isArray(window.PROMPTS) ? window.PROMPTS : [];
  const resources = Array.isArray(window.RESOURCES) ? window.RESOURCES : [];
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
    drafts: readStore(draftKey)
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
        prompt.source,
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
      return `
        <article class="prompt-card ${liked ? "is-liked" : ""}" data-id="${escapeHtml(prompt.id)}">
          <div class="prompt-card-top">
            <span class="category-pill">${escapeHtml(labels[prompt.category])}</span>
            <span class="phase">${escapeHtml(prompt.phase)}</span>
          </div>
          <h3>${escapeHtml(prompt.title)}</h3>
          <p class="summary">${escapeHtml(prompt.summary)}</p>
          <p class="benefit"><span>メリット</span>${escapeHtml(prompt.benefit)}</p>
          <div class="tag-list">${prompt.tags.map(function (tag) {
            return `<span>${escapeHtml(tag)}</span>`;
          }).join("")}</div>
          <p class="source">出典: ${escapeHtml(prompt.source)}</p>
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
    state.currentId = id;
    dialogTitle.textContent = prompt.title;
    dialogMeta.textContent = `${labels[prompt.category]} / ${prompt.phase} / ${prompt.source}`;
    dialogBenefit.textContent = prompt.benefit;
    promptEditor.value = getPromptText(prompt);
    customizeList.innerHTML = prompt.customize.map(function (item) {
      return `<li>${escapeHtml(item)}</li>`;
    }).join("");

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
      return `${index + 1}. ${prompt.title}（${labels[prompt.category]} / ${prompt.phase}）`;
    }).join("\n");
    copyText(text, "いいね一覧をコピーしました");
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
})();
