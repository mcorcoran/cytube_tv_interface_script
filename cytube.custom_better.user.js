// ==UserScript==
// @name         CyTube Fullscreen Video with Overlay Chat (TV-friendly)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fullscreen video + overlay chat, hide user list, contain messages and GIFs on Android TV
// @match        https://cytu.be/r/420Grindhouse
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- INPUTMODE SUPPRESSION ---------- */
    const applyInputMode = () => {
        const input = document.getElementById("chatline");
        if (input && input.getAttribute("inputmode") !== "none") {
            input.setAttribute("inputmode", "none");
        }
    };

    const waitForBody = () => {
        if (!document.body) {
            requestAnimationFrame(waitForBody);
            return;
        }

        // Apply immediately
        applyInputMode();

        // Observe DOM changes (CyTube recreates chatline)
        const observer = new MutationObserver(applyInputMode);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    waitForBody();

    /* ---------- CSS / LAYOUT ---------- */
    window.addEventListener('load', () => {
        const style = document.createElement('style');
        style.textContent = `
            /* ---------- Video / layout ---------- */
            #videowrap {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 80vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: black !important;
            }

            #videowrap .embed-responsive,
            #ytapiplayer {
                width: 80vw !important;
                height: 100vh !important;
            }

            /* Hide nav and other elements */
            nav.navbar,
            #motdrow,
            #drinkbarwrap,
            #announcements,
            #playlistrow,
            #resizewrap,
            footer,
            #userlist,
            #userlisttoggle {
                display: none !important;
            }

            /* ---------- Chat overlay ---------- */
            #chatwrap {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                width: 20vw !important;
                height: 100vh !important;
                z-index: 10000 !important;
                background: rgba(0,0,0,0.7) !important;
                overflow: hidden !important; /* contain children */
                box-sizing: border-box !important;
                padding: 5px !important;
            }

            #messagebuffer {
                height: calc(100% - 80px) !important;
                width: 100% !important;
                overflow-y: auto !important;
                overflow-x: hidden !important;
                color: white !important;
                background: transparent !important;
                font-size: 14px !important;
                box-sizing: border-box !important;
                word-wrap: break-word !important;
            }

            #messagebuffer .chat-msg {
                white-space: normal !important;
                word-break: break-word !important;
                overflow-wrap: break-word !important;
            }

            /* Contain images/GIFs in chat */
            #messagebuffer img,
            #messagebuffer video {
                max-width: 100% !important;
                max-height: 200px !important;  /* adjust if you want taller GIFs */
                height: auto !important;
                display: block !important;
                object-fit: contain !important;
                margin-bottom: 2px !important;
            }

            /* ---------- Chat input ---------- */
            #chatline {
                background: rgba(255,255,255,0.1) !important;
                color: white !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }

            #chatline::placeholder {
                color: rgba(255,255,255,0.7) !important;
            }

            /* Other UI tweaks */
            #controlsrow {
                height: 0 !important;
                overflow: hidden !important;
            }

            #emotelistbtn {
                position: fixed !important;
                bottom: 5px !important;
                right: 20vw !important;
                z-index: 20002 !important;
            }

            .modal,
            .popover,
            .dropdown-menu {
                z-index: 20001 !important;
            }

            #chatheader {
                background: rgba(0,0,0,0.5) !important;
                color: white !important;
                border: none !important;
                margin-bottom: 5px !important;
            }

            .vjs-control-bar {
                opacity: 0.8 !important;
            }

            .vjs-control-bar:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    });
})();
