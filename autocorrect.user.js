// ==UserScript==
// @name         AI Auto Spell/Grammar Corrector with Indicator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'http://192.168.1.44:11434/api/generate'; // Your Beelink
    const MODEL = 'phi3';
    const DEBOUNCE_MS = 1000; // 1 second pause

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const showIndicator = (el) => {
        const indicator = document.createElement('span');
        indicator.innerText = '✓';
        indicator.style.position = 'absolute';
        indicator.style.background = 'rgba(0,128,0,0.7)';
        indicator.style.color = 'white';
        indicator.style.borderRadius = '50%';
        indicator.style.padding = '2px 6px';
        indicator.style.fontSize = '12px';
        indicator.style.zIndex = '9999';
        indicator.style.pointerEvents = 'none';

        // Position indicator at top-right of the element
        const rect = el.getBoundingClientRect();
        indicator.style.top = `${rect.top + window.scrollY}px`;
        indicator.style.left = `${rect.left + rect.width - 15 + window.scrollX}px`;

        document.body.appendChild(indicator);

        setTimeout(() => indicator.remove(), 1200); // Remove after 1.2s
    };

    const sendToAI = async (text) => {
        if (!text.trim()) return text;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: MODEL,
                    prompt: `Fix grammar and spelling only. Do not change meaning. Return only corrected text:\n\n${text}`,
                    max_tokens: 2000
                })
            });
            const data = await response.json();
            return data?.text || text;
        } catch (err) {
            console.error('AI correction error:', err);
            return text;
        }
    };

    const correctField = async (el) => {
        let original, corrected;
        if (el.isContentEditable) {
            original = el.innerText;
            corrected = await sendToAI(original);
            if (corrected !== original) {
                el.innerText = corrected;
                showIndicator(el);
            }
        } else {
            original = el.value;
            corrected = await sendToAI(original);
            if (corrected !== original) {
                el.value = corrected;
                showIndicator(el);
            }
        }
    };

    const debouncedCorrect = debounce(correctField, DEBOUNCE_MS);

    document.addEventListener('input', (e) => {
        const el = e.target;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) {
            debouncedCorrect(el);
        }
    });

})();
