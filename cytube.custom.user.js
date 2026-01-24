// ==UserScript==
// @name         CyTube Fullscreen Video + Overlay Chat (Firefox Android Safe)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Fullscreen video with overlay chat while allowing Firefox Android to hide the URL bar
// @match        https://cytu.be/r/420Grindhouse
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {

        /* ---- FORCE REAL DOCUMENT SCROLL (CRITICAL) ---- */
        const spacer = document.createElement('div');
        spacer.style.height = '3vh';
        spacer.style.pointerEvents = 'none';
        document.body.appendChild(spacer);

        const style = document.createElement('style');
        style.textContent = `
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                min-height: 100vh !important;
                overflow-y: auto !important;
                background: black !important;
            }

            /* ---- VIDEO LAYOUT ---- */
            #videowrap {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 80vw !important;
                min-height: 100vh !important;
                background: black !important;
                z-index: 1 !important;
            }

            #videowrap .embed-responsive,
            #ytapiplayer {
                width: 100% !important;
                min-height: 100vh !important;
                height: auto !important;
            }

            /* ---- CHAT OVERLAY ---- */
            #chatwrap {
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
                width: 20vw !important;
                min-height: 100vh !important;
                background: rgba(0,0,0,0.7) !important;
                z-index: 2 !important;
            }

            /* ---- ALLOW DOCUMENT SCROLL, NOT INNER LOCK ---- */
            #messagebuffer {
                min-height: calc(100vh - 80px) !important;
                overflow: visible !important;
                background: transparent !important;
                color: white !important;
                font-size: 14px !important;
            }

            /* ---- HIDE UNNECESSARY UI ---- */
            nav.navbar,
            #motdrow,
            #drinkbarwrap,
            #announcements,
            #playlistrow,
            #controlsrow,
            #resizewrap,
            footer,
            #userlist,
            #userlisttoggle {
                display: none !important;
            }

            /* ---- CHAT INPUT ---- */
            #chatline {
                background: rgba(255,255,255,0.1) !important;
                color: white !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                width: 100% !important;
            }

            #chatline::placeholder {
                color: rgba(255,255,255,0.7) !important;
            }

            #chatheader {
                background: rgba(0,0,0,0.5) !important;
                color: white !important;
                border: none !important;
                margin-bottom: 5px !important;
            }

            /* ---- VIDEO CONTROLS ---- */
            .vjs-control-bar {
                opacity: 0.85 !important;
            }

            .vjs-control-bar:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);

        /* ---- OPTIONAL: SCROLL NUDGE (helps trigger bar collapse) ---- */
        setTimeout(() => {
            window.scrollBy(0, 20);
        }, 500);
    });
})();
