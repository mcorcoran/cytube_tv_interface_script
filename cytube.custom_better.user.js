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

            /* chatwrap: vertical column layout */
            #chatwrap {
                display: flex !important;
                flex-direction: column !important;
                width: 20vw !important;
                max-width: 20vw !important;
                height: 100vh !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
                padding: 4px 8px !important;
            }

            /* messagebuffer becomes flex item that scrolls */
            #messagebuffer {
                flex: 1 1 auto !important;
                min-height: 0 !important; /* critical for flex scroll */
                overflow-y: auto !important;
                overflow-x: hidden !important;
                width: 100% !important;
                box-sizing: border-box !important;
                word-break: break-word !important;
            }

            /* ensure text wraps */
            #messagebuffer .chat-msg,
            #messagebuffer .chat-msg span,
            #messagebuffer .chat-msg div {
                white-space: normal !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }

            /* contain images/videos */
            #messagebuffer img,
            #messagebuffer video {
                max-width: 100% !important;
                max-height: 160px !important; /* reduce huge media */
                object-fit: contain !important;
                display: block !important;
                margin: 2px 0 !important;
            }

            /* input stays pinned at bottom */
            #chatline {
                flex-shrink: 0 !important;
                width: 100% !important;
                box-sizing: border-box !important;
                margin-top: 4px !important;
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
