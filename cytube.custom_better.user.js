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
        const chatinput = document.getElementById("chatline");
        if (chatinput && chatinput.getAttribute("inputmode") !== "none") {
            chatinput.setAttribute("inputmode", "none");
        }
        //Not working
        const emoteinput = document.getElementsByClassName("emotelist-search");
        if (emoteinput && emoteinput.getAttribute("inputmode") !== "none") {
            emoteinput.setAttribute("inputmode", "none");
        }
    };

    //TODO add button next to emote button to toggle fullscreen

        /* ---------- Full Screen ---------- */
    const addFullscreenOverlay = () => {
        const fsOverlay = document.createElement("div");
        fsOverlay.style.position = "fixed";
        fsOverlay.style.inset = "0";
        fsOverlay.style.zIndex = "999999";
        fsOverlay.style.cursor = "pointer";
        fsOverlay.style.background = "transparent";

        fsOverlay.addEventListener("click", () => {
            document.documentElement.requestFullscreen().catch(() => {});
            fsOverlay.remove();
        }, { once: true });

        document.body.appendChild(fsOverlay);
    };

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        } else {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    }
    const addFullscreenButton = () => {
        const emoteBtn = document.getElementById("emotelistbtn");
        if (!emoteBtn) return;

        // Avoid duplicates
        if (document.getElementById("fs-toggle-btn")) return;

        const fsBtn = document.createElement("button");
        fsBtn.id = "fs-toggle-btn";
        fsBtn.textContent = "⛶"; // fullscreen icon
        fsBtn.title = "Toggle Fullscreen";

        fsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFullscreen();
        });

        emoteBtn.parentElement.appendChild(fsBtn);
    };

    const waitForBody = () => {
        if (!document.body) {
            requestAnimationFrame(waitForBody);
            return;
        }

        // Add fullscreen overlay AFTER body exists
        addFullscreenButton();
        //addFullscreenOverlay();

        // Apply immediately
        applyInputMode();

        // Observe DOM changes (CyTube recreates chatline)
        const observer = new MutationObserver(() => {
            applyInputMode();
            addFullscreenButton();
        });
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

            #fs-toggle-btn {
                position: fixed !important;
                bottom: 5px !important;
                right: calc(20vw + 45px) !important; /* next to emote button */
                z-index: 20002 !important;

                background: rgba(0,0,0,0.7) !important;
                color: white !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                border-radius: 4px !important;
                padding: 6px 10px !important;
                font-size: 16px !important;
                cursor: pointer !important;
            }

            #fs-toggle-btn:focus {
                outline: 2px solid white !important;
            }            
        `;
        document.head.appendChild(style);
    });
})();
