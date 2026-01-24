// ==UserScript==
// @name         CyTube Fullscreen Video + Overlay Chat (Firefox Android HARD FIX)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Forces Firefox Android to hide URL bar using top overflow technique
// @match        https://cytu.be/r/420Grindhouse
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {

        /* ---- CREATE TOP SPACER (CRITICAL) ---- */
        const topSpacer = document.createElement('div');
        topSpacer.style.height = '120px';
        topSpacer.style.width = '100%';
        topSpacer.style.pointerEvents = 'none';
        topSpacer.style.background = 'transparent';
        document.body.prepend(topSpacer);

        /* ---- CREATE BOTTOM SPACER (SECONDARY) ---- */
        const bottomSpacer = document.createElement('div');
        bottomSpacer.style.height = '120px';
        bottomSpacer.style.width = '100%';
        bottomSpacer.style.pointerEvents = 'none';
        document.body.appendChild(bottomSpacer);

        const style = document.createElement('style');
        style.textContent = `
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                min-height: 100vh !important;
                overflow-y: auto !important;
                background: black !important;
            }

            /* ---- VIDEO ---- */
            #videowrap {
                position: absolute !important;
                top: 120px !important; /* match spacer */
                left: 0 !important;
                width: 80vw !important;
                min-height: calc(100vh - 120px) !important;
                background: black !important;
                z-index: 1 !important;
            }

            #videowrap .embed-responsive,
            #ytapiplayer {
                width: 100% !important;
                min-height: calc(100vh - 120px) !important;
                height: auto !important;
            }

            /* ---- CHAT ---- */
            #chatwrap {
                position: absolute !important;
                top: 120px !important;
                right: 0 !important;
                width: 20vw !important;
                min-height: calc(100vh - 120px) !important;
                background: rgba(0,0,0,0.7) !important;
                z-index: 2 !important;
            }

            #messagebuffer {
                overflow: visible !important;
                background: transparent !important;
                color: white !important;
                font-size: 14px !important;
            }

            /* ---- HIDE UI ---- */
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

            #chatline {
                background: rgba(255,255,255,0.1) !important;
                color: white !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                width: 100% !important;
            }

            #chatheader {
                background: rgba(0,0,0,0.5) !important;
                color: white !important;
                border: none !important;
                margin-bottom: 5px !important;
            }

            .vjs-control-bar {
                opacity: 0.85 !important;
            }
        `;
        document.head.appendChild(style);

        /* ---- FORCE INITIAL SCROLL PAST TOP ---- */
        setTimeout(() => {
            window.scrollTo(0, 150);
        }, 300);
    });
})();
