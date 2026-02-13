// ==UserScript==
// @name         CyTube Ultimate Overlay with local LLM Correction
// @description  Large number of UI improvments to help with watching on TV and grammar correction
// @namespace    http://tampermonkey.net/
// @version      3.9
// @match        https://cytu.be/r/420Grindhouse
// @match        https://cytu.be/r/test5
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      192.168.1.44
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const OLLAMA_URL = "http://192.168.1.44:11434/api/chat";
    const MODEL = "llama3.2:1b";
    let isModalOpen = false;

    /* ---------- CSS / LAYOUT ---------- */
    GM_addStyle(`
        #videowrap { position: fixed !important; top: 0 !important; left: 0 !important; width: 80vw !important; height: 100vh !important; z-index: 9999 !important; background: black !important; }
        #videowrap-header {
            border: 0 !important;
            opacity: 0.5 !important;
        }
        #videowrap .embed-responsive, #ytapiplayer { width: 80vw !important; height: 100vh !important;  }
        #modflair, nav.navbar, #motdrow, #drinkbarwrap, #announcements, #playlistrow, #resizewrap, footer, #userlist, #userlisttoggle, #rightcontrols, .modal-header, .timestamp, .modal-footer,#resize-video-smaller,#resize-video-larger { display: none !important; }

        #chatwrap {
            position: fixed !important; top: 0 !important; right: 0 !important;
            width: 20vw !important; height: 100vh !important; z-index: 9999 !important;
            background: rgba(0,0,0,0.7) !important; overflow: hidden !important;
            display: flex !important; flex-direction: column !important;
        }

        #messagebuffer { flex: 1 1 auto !important; height: 100% !important; background: transparent !important; color: white !important; font-size: 14px !important; overflow-y: auto !important; padding-bottom: 5px !important; }

        #chatline { display: none !important; visibility: hidden !important; }
        .video-js .vjs-control-bar {
            bottom: 20px !important;
            width: 80% !important;
        }
        .modal,
        .popover,
        .dropdown-menu {
            z-index: 20001 !important;
        }            
        /* FIXED: Added vertical padding buffer for Android TV */
        .smart-input-wrapper {
            flex: 0 0 auto !important;
            position: relative !important;
            width: 100% !important;
            background: rgba(20,20,20,0.95) !important;
            border-top: 1px solid rgba(255,255,255,0.1) !important;
            padding: 0px !important;
            box-sizing: border-box !important;
        }

        #customChatArea {
            background: rgba(255,255,255,0.1) !important;
            color: white !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            width: 100% !important;
            resize: none !important;
            overflow: hidden !important;
            min-height: 42px !important; /* Slightly taller for TV readability */
            max-height: 250px !important;
            padding: 10px 40px 10px 12px !important;
            border-radius: 4px !important;
            font-family: inherit !important;
            display: block !important;
            box-sizing: border-box !important;
        }

        #ai-trigger-btn {
            position: absolute;
            right: 20px;
            top: 5px; /* Fixed position relative to top to avoid shift */
            background: none; border: none; cursor: pointer;
            font-size: 18px; opacity: 0.6; z-index: 10001;
            transition: transform 0.3s ease;
        }

        .ai-spinning { animation: ai-spin 1s infinite linear; opacity: 1 !important; }
        @keyframes ai-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        #emotelistbtn, #fs-toggle-btn, #reload-video-btn { position: fixed !important; bottom: 5px !important; z-index: 20002 !important; background: rgba(0,0,0,0.7) !important; color: white !important; border: 1px solid rgba(255,255,255,0.3) !important; border-radius: 4px !important; padding: 3px 10px !important; cursor: pointer !important; }
        #emotelistbtn { right: 20vw !important; }
        #fs-toggle-btn { right: calc(20vw + 50px) !important; }
        #reload-video-btn { right: calc(20vw + 150px) !important; }

        #llmModal {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #1a1a1a; color: #eee; padding: 25px; border: 1px solid #4caf50;
            z-index: 100000; width: 85%; max-width: 450px; border-radius: 8px; box-shadow: 0 10px 50px rgba(0,0,0,0.9);
        }
        body { background: #000 !important; overflow: hidden !important; }
    `);



    /* ---------- LOGIC ---------- */

    const submitFinal = (text, textarea, originalInput) => {
        originalInput.value = text;
        const enterEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13, which: 13, key: 'Enter' });
        originalInput.dispatchEvent(enterEvent);
        textarea.value = "";
        textarea.style.height = "42px";
        isModalOpen = false;
    };

    const processLLM = (text, textarea, originalInput) => {
        if (!text || isModalOpen) return;
        const aiBtn = document.getElementById("ai-trigger-btn");
        if (aiBtn) aiBtn.classList.add("ai-spinning");
        textarea.style.opacity = "0.5";

        GM_xmlhttpRequest({
            method: "POST",
            url: OLLAMA_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                "model": MODEL,
                "messages": [
                    { "role": "system", "content": "Correct spelling and grammar. Output ONLY the corrected text. No chat." },
                    { "role": "user", "content": text }
                ],
                "stream": false,
                "options": { "temperature": 0 }
            }),
            onload: (res) => {
                if (aiBtn) aiBtn.classList.remove("ai-spinning");
                textarea.style.opacity = "1";
                try {
                    const corrected = JSON.parse(res.responseText).message.content.trim();
                    if (corrected.toLowerCase() === text.toLowerCase()) {
                        submitFinal(text, textarea, originalInput);
                    } else {
                        showModal(text, corrected, () => submitFinal(corrected, textarea, originalInput));
                    }
                } catch (e) { submitFinal(text, textarea, originalInput); }
            },
            onerror: () => {
                if (aiBtn) aiBtn.classList.remove("ai-spinning");
                textarea.style.opacity = "1";
                submitFinal(text, textarea, originalInput);
            }
        });
    };

    const initSmartInput = () => {
        const original = document.getElementById("chatline");
        const chatWrap = document.getElementById("chatwrap");
        if (!original || !chatWrap || document.getElementById("customChatArea")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "smart-input-wrapper";
        const textarea = document.createElement("textarea");
        textarea.id = "customChatArea";
        textarea.placeholder = "Message...";
        textarea.setAttribute("inputmode", "none");
        const aiBtn = document.createElement("button");
        aiBtn.id = "ai-trigger-btn";
        aiBtn.innerHTML = "✨";

        wrapper.appendChild(textarea);
        wrapper.appendChild(aiBtn);
        chatWrap.appendChild(wrapper);

        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height = (textarea.scrollHeight) + "px";
        });

        textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                if (isModalOpen) {
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                const val = textarea.value.trim();
                if (!val) return;

                if (e.ctrlKey) {
                    processLLM(val, textarea, original);
                } else {
                    submitFinal(val, textarea, original);
                }
            }
        });

        aiBtn.onclick = () => processLLM(textarea.value.trim(), textarea, original);
    };

    function showModal(original, corrected, onAccept) {
        isModalOpen = true;
        const m = document.createElement("div");
        m.id = "llmModal";
        m.innerHTML = `
            <div style="margin-bottom:15px;"><b style="color:#4caf50; font-size:16px;">AI Suggestion:</b><br><span style="font-size:15px;">${corrected}</span></div>
            <div style="font-size: 12px; color: #888; margin-bottom: 15px;">[Enter] Send | [Esc] Cancel</div>
            <div style="display:flex; justify-content:flex-end; gap:12px;">
                <button id="mNo" style="background:none; border:none; color:#aaa; cursor:pointer; font-size:16px;">Cancel</button>
                <button id="mYes" style="background:#4caf50; color:white; border:none; padding:10px 20px; border-radius:4px; font-weight:bold; cursor:pointer; font-size:16px;">Send</button>
            </div>
        `;
        document.body.appendChild(m);

        const closeModal = () => { isModalOpen = false; m.remove(); document.removeEventListener("keydown", modalKeyHandler); };

        const modalKeyHandler = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopImmediatePropagation();
                onAccept();
                closeModal();
            } else if (e.key === "Escape") {
                e.preventDefault();
                e.stopImmediatePropagation(); // Stops browser from exiting fullscreen
                closeModal();
            }
        };

        document.addEventListener("keydown", modalKeyHandler);
        document.getElementById("mYes").onclick = () => { onAccept(); closeModal(); };
        document.getElementById("mNo").onclick = closeModal;
    }

    // ---- USER COLOR SYSTEM ----
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function usernameToColor(username) {
        const hash = hashString(username);
        return `hsl(${hash % 360}, ${75 + (hash % 15)}%, ${60 + (hash % 10)}%)`;
    }

    function applyUserColors() {
        const userElements = document.querySelectorAll('#messagebuffer [class*="chat-msg-"]');
        userElements.forEach(el => {
            const userClass = [...el.classList].find(c => c.startsWith('chat-msg-'));
            if (!userClass) return;
            const username = userClass.replace('chat-msg-', '');
            const nameSpan = el.querySelector('.username');
            if (nameSpan) {
                nameSpan.style.color = usernameToColor(username);
                nameSpan.style.fontWeight = "700";
            }
        });
    }

    function startUserColorObserver() {
        const buffer = document.getElementById('messagebuffer');
        if (!buffer || buffer.dataset.observerSet) return false;
        const chatObserver = new MutationObserver(applyUserColors);
        chatObserver.observe(buffer, { childList: true, subtree: true });
        buffer.dataset.observerSet = "true";
        applyUserColors();
        return true;
    }

    // --- Button Updates ---
    const applyInputMode = () => {
        const chatinput = document.getElementById("chatline");
        if (chatinput && chatinput.getAttribute("inputmode") !== "none") {
            chatinput.setAttribute("inputmode", "none");
        }
        const emoteInputs = document.getElementsByClassName("emotelist-search");
        for (const input of emoteInputs) {
            if (input.getAttribute("inputmode") !== "none") input.setAttribute("inputmode", "none");
        }
    };

   function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        } else {
            document.documentElement.requestFullscreen().catch(() => { });
        }
    }

    const updateFullscreenButtonVisibility = () => {
        const fsBtn = document.getElementById("fs-toggle-btn");
        if (!fsBtn) return;

        fsBtn.style.display = document.fullscreenElement ? "none" : "";
    };

    document.addEventListener("fullscreenchange", updateFullscreenButtonVisibility);

    const addFullscreenButton = () => {
        const emoteBtn = document.getElementById("emotelistbtn");
        if (!emoteBtn) return;

        if (document.getElementById("fs-toggle-btn")) return;

        const fsBtn = document.createElement("button");
        fsBtn.id = "fs-toggle-btn";
        fsBtn.textContent = "⛶";
        fsBtn.title = "Toggle Fullscreen";

        fsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFullscreen();
        });

        emoteBtn.parentElement.appendChild(fsBtn);
        updateFullscreenButtonVisibility();
    };

    const applyEmotePickerIcon = () => {
        const btn = document.getElementById("emotelistbtn");
        if (!btn) return;

        // Prevent reapplying if CyTube rebuilds DOM
        if (btn.dataset.pickerApplied) return;

        btn.textContent = "▦";
        btn.title = "Emotes";
        btn.setAttribute("aria-label", "Emote Picker");

        btn.dataset.pickerApplied = "true";
    };
    setInterval(() => {
        initSmartInput();
    }, 1000);

    const waitForBody = () => {
        if (!document.body) {
            requestAnimationFrame(waitForBody);
            return;
        }

        applyInputMode();
        addFullscreenButton();
        applyEmotePickerIcon();
        startUserColorObserver();
        const observer = new MutationObserver(() => {
            applyInputMode();
            addFullscreenButton();
            applyEmotePickerIcon();

            if (!document.getElementById('tv-color-init')) {
                if (startUserColorObserver()) {
                    const flag = document.createElement('div');
                    flag.id = 'tv-color-init';
                    flag.style.display = 'none';
                    document.body.appendChild(flag);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };


    waitForBody();    
})();``