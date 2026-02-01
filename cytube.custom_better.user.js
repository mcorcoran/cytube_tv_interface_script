// ==UserScript==
// @name         CyTube Fullscreen Video with Overlay Chat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Make video fullscreen and overlay chat messages over it, hide user list
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

            /* Overlay chat over video */
            #chatwrap {
                position: fixed !important;
                top: 0px !important;
                right: 0px !important;
                width: 20vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: rgba(0, 0, 0, 0.7) !important;
                overflow: hidden !important;
            }

            /* Style chat messages */
            #messagebuffer {
                height: calc(100% - 80px) !important;
                background: transparent !important;
                color: white !important;
                font-size: 14px !important;
                overflow-y: auto !important;
            }

            #chatline {
                background: rgba(255,255,255,0.1) !important;
                color: white !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                width: 100% !important;
            }

            #chatline::placeholder {
                color: rgba(255,255,255,0.7) !important;
            }

            .modal,
            .popover,
            .dropdown-menu {
                z-index: 20001 !important;
            }

            #emotelistbtn {
                position: fixed !important;
                bottom: 5px !important;
                right: 20vw !important;
                z-index: 20002 !important;
            }
        `;
        document.head.appendChild(style);
    });
})();
