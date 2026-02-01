// ==UserScript==
// @name         CyTube Fullscreen Video with Overlay Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make video fullscreen and overlay chat messages over it, hide user list
// @author       You
// @match        https://cytu.be/r/420Grindhouse
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Inject custom CSS
        const style = document.createElement('style');
        style.textContent = `
            /* Make video fullscreen */
            #videowrap {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 80vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: black !important;
            }

            #videowrap .embed-responsive {
                height: 100vh !important;
                width: 80vw !important;
            }

            #ytapiplayer {
                height: 100vh !important;
                width: 80vw !important;
            }

            /* Hide navbar and other elements */
            nav.navbar {
                display: none !important;
            }

            #motdrow, #drinkbarwrap, #announcements, #playlistrow, #controlsrow, #resizewrap, footer {
                display: none !important;
            }

            /* Overlay chat over video */
            #chatwrap {
                position: fixed !important;
                top: 0px !important;
                right: 0px !important;
                width: 20vw !important;
                height: 100vh !important;
                z-index: 10000 !important;
                background: rgba(0, 0, 0, 0.7) !important;
                overflow: hidden !important;
            }

            /* Hide user list */
            #userlist {
                display: none !important;
            }

            /* Style chat messages */
            #messagebuffer {
                height: calc(100% - 80px) !important;
                background: transparent !important;
                color: white !important;
                font-size: 14px !important;
                overflow-y: auto !important;
            }

            #messagebuffer .chat-msg {
                color: white !important;
            }

            /* Style chat input */
            #chatline {
                background: rgba(255, 255, 255, 0.1) !important;
                color: white !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                width: 100% !important;
            }

            #chatline::placeholder {
                color: rgba(255, 255, 255, 0.7) !important;
            }

            /* Hide chat header toggle */
            #userlisttoggle {
                display: none !important;
            }

            /* Adjust chat header */
            #chatheader {
                background: rgba(0, 0, 0, 0.5) !important;
                color: white !important;
                border: none !important;
                margin-bottom: 5px !important;
            }

            /* Make sure video controls are visible */
            .vjs-control-bar {
                opacity: 0.8 !important;
            }

            .vjs-control-bar:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);

        // Function to make video fullscreen
        function makeFullscreen() {
            const videoPlayer = document.getElementById('ytapiplayer');
            if (videoPlayer && videoPlayer.requestFullscreen) {
                videoPlayer.requestFullscreen();
            }
        }

    });
})();