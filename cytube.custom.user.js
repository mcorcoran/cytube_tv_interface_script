// ==UserScript==
// @name         CyTube Fullscreen Video with Overlay Chat (Firefox Android Safe)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fullscreen video with overlay chat, compatible with Firefox Android URL bar hiding
// @match        https://cytu.be/r/420Grindhouse
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {

        const style = document.createElement('style');
        style.textContent = `
            html, body {
                overflow-y: auto !important;
                height: auto !important;
                min-height: 100vh !important;
                margin: 0 !important;
            }

            /* Video container */
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

            /* Overlay chat */
            #chatwrap {
                position: absolute !important;
                top: 0 !important;
                right: 0 !important;
                width: 20vw !important;
                min-height: 100vh !important;
                background: rgba(0, 0, 0, 0.7) !important;
                z-index: 2 !important;
            }

            /* Allow document scrolling instead of inner-only scroll */
            #messagebuffer {
                min-height: calc(100vh - 80px) !important;
                overflow: visible !important;
                background: transparent !important;
                color: white !important;
                font-size: 14px !important;
            }

            /* Hide UI clutter */
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

            #chatline::placeholder {
                color: rgba(255,255,255,0.7) !important;
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

            .vjs-control-bar:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    });
})();
