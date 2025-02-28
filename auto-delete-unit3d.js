// ==UserScript==
// @name        auto-delete-unit3d
// @version     1.2.0
// @namespace   https://github.com/rkeaves
// @description Automates deletion of torrents on UNIT3D trackers using a list of URLs. Processes URLs sequentially, detects 404 pages as successful deletion, and if a 404 page is encountered (showing the Go Home button), it simulates a click on it to return to home before proceeding. Also adds “Add” buttons next to torrent links so you can quickly append URLs to the queue.
// @match       https://privatesilverscreen.cc/*
// @match       https://onlyencodes.cc/*
// @match       https://blutopia.cc/*
// @match       https://yu-scene.net/*
// @match       https://fearnopeer.com/*
// @match       https://aither.cc/*
// @match       https://capybarabr.com/*
// @match       https://locadora.cc/*
// @downloadURL https://github.com/rkeaves/auto-delete-unit3d/raw/main/auto-delete-unit3d.js
// @updateURL   https://github.com/rkeaves/auto-delete-unit3d/raw/main/auto-delete-unit3d.js
// @author      rkeaves
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    const STORAGE_KEY = 'autoDeleteQueue';
    const REASON_TEXT = 'sorry, file deleted !'; // Deletion reason text
    const DELAY = 10000; // Delay in ms

    class TorrentDeleter {
        constructor() {
            this.queue = GM_getValue(STORAGE_KEY, null);
            this.isProcessing = false;
            this.createUI();
            this.createStopButton();
            this.init();
        }

        init() {
            // Always update the queue from storage.
            this.queue = GM_getValue(STORAGE_KEY, null);
            console.log("Current queue:", this.queue);
            // If a deletion queue exists, update progress indicator in the textarea.
            if (this.queue && this.queue.urls && this.queue.urls.length) {
                this.updateProgress();
            }
            if (this.isTorrentPage()) {
                if (this.isDetailPage()) {
                    // We're on a torrent detail page – handle deletion.
                    this.handleTorrentPage();
                } else {
                    // Not on a detail page; if there's a queued URL, redirect.
                    if (this.queue && this.queue.index < this.queue.urls.length) {
                        console.log("Not on a detail page. Redirecting to next URL:", this.queue.urls[this.queue.index]);
                        window.location.href = this.queue.urls[this.queue.index];
                    }
                }
            } else {
                // If not on a torrent page (e.g., home page), and a queue exists, navigate to next URL.
                if (this.queue && this.queue.index < this.queue.urls.length) {
                    window.location.href = this.queue.urls[this.queue.index];
                }
            }
        }

        isTorrentPage() {
            return window.location.href.includes('/torrents');
        }

        isDetailPage() {
            // A torrent detail page is assumed to have "/torrents/<number>" in the pathname.
            return /\/torrents\/\d+/.test(window.location.pathname);
        }

        // Modified: Update the textarea with progress information.
        updateProgress() {
            if (this.queue && this.textarea) {
                const total = this.queue.urls.length;
                if (this.queue.index < total) {
                    const current = this.queue.index + 1;
                    this.textarea.value = `Processing link #${current} of ${total}`;
                } else {
                    this.textarea.value = 'Queue completed.';
                }
            }
        }

        createUI() {
            if (document.getElementById("autoDeleteUI")) return; // Avoid duplicates.
            const container = document.createElement('div');
            container.id = "autoDeleteUI";
            container.style = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                padding: 20px;
                z-index: 10000;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                border-radius: 8px;
                font-family: Arial, sans-serif;
                width: 330px;
            `;

            const title = document.createElement('h3');
            title.textContent = 'Auto Delete Torrents';
            title.style = 'margin-top: 0; color: #343a40;';

            // Create the main instructions paragraph
            const instructions = document.createElement('p');
            instructions.innerHTML = 'Enter one URL per line:<br><span style="font-size: 12px; font-style: italic; color: #6c757d;">Try a refresh if Add isn’t working.</span>';
            instructions.style = 'font-size: 14px; color: #495057; margin: 10px 0;';

            // Append the instructions to the desired parent element
            document.body.appendChild(instructions);

            const textarea = document.createElement('textarea');
            textarea.style = `
                width: 100%;
                height: 150px;
                padding: 8px;
                border: 1px solid #ced4da;
                border-radius: 4px;
                font-size: 14px;
            `;
            textarea.placeholder = 'https://privatesilverscreen.cc/torrents/8689\nhttps://privatesilverscreen.cc/torrents/6969';
            // Save reference for progress updates.
            this.textarea = textarea;

            // Auto-newline on paste:
            textarea.addEventListener('paste', (e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text');
                // Split pasted text by whitespace and join with newline
                const urls = pastedText.split(/\s+/).filter(word => word.trim() !== '');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const before = textarea.value.substring(0, start);
                const after = textarea.value.substring(end);
                const newText = urls.join('\n');
                textarea.value = before + newText + after;
                // Move the cursor to the end of the inserted text
                textarea.selectionStart = textarea.selectionEnd = start + newText.length;
            });

            // Auto-newline on typing a space after a URL:
            textarea.addEventListener('keydown', function(e) {
                if (e.key === ' ') {
                    // Get the text before the cursor and split by whitespace/newlines.
                    const textBeforeCursor = this.value.substring(0, this.selectionStart);
                    const words = textBeforeCursor.split(/[\s\n]+/);
                    const lastWord = words[words.length - 1];
                    // If the last word starts with "http://" or "https://", insert a newline instead of a space.
                    if (lastWord.startsWith('http://') || lastWord.startsWith('https://')) {
                        e.preventDefault();
                        this.value = this.value.trimEnd() + "\n";
                        this.selectionStart = this.selectionEnd = this.value.length;
                    }
                }
            });

            // --- New: Auto-newline on drop ---
            textarea.addEventListener('drop', (e) => {
                e.preventDefault();
                const droppedText = e.dataTransfer.getData('text/plain');
                if (droppedText) {
                    // Split by whitespace to support multiple links being dropped
                    const links = droppedText.split(/\s+/).filter(link => link.trim() !== '');
                    // Get current value and ensure it ends with a newline if not empty
                    const currentContent = textarea.value.trim();
                    const prefix = currentContent ? currentContent + "\n" : "";
                    // Append the dropped links, one per line
                    textarea.value = prefix + links.join("\n") + "\n";
                }
            });
            // --- End new drop event listener ---

            const button = document.createElement('button');
            button.style = `
                display: block;
                width: 100%;
                padding: 10px;
                background: #dc3545;
                color: #fff;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                margin-top: 10px;
            `;
            button.textContent = 'Start Auto Delete';

            button.addEventListener('click', () => {
                const urls = textarea.value.split('\n').map(url => url.trim()).filter(url => url);
                if (urls.length === 0) {
                    alert('Please enter at least one URL!');
                    return;
                }
                const queueObj = { urls, index: 0 };
                GM_setValue(STORAGE_KEY, queueObj);
                console.log("Queue set:", queueObj);
                window.location.href = urls[0];
            });

            // --- Add All Button ---
            const addAllButton = document.createElement('button');
            addAllButton.textContent = 'Add All';
            addAllButton.style = `
                position: absolute;
                top: 50px;  /* Adjust this value as needed to place it directly below the Stop button */
                right: 10px;
                padding: 5px 10px;
                background: #6c757d;
                color: #fff;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
            `;
            addAllButton.addEventListener('click', () => {
                const links = document.querySelectorAll('a.user-uploads__name');
                if (!links.length) {
                    alert('No torrent links found on this page!');
                    return;
                }
                const urls = Array.from(links).map(link => link.href.trim());
                const textarea = container.querySelector('textarea');
                const existingContent = textarea.value.trim();
                const separator = existingContent ? '\n' : '';
                textarea.value = existingContent + separator + urls.join('\n') + '\n';
                textarea.style.backgroundColor = '#e2f7d4';
                setTimeout(() => { textarea.style.backgroundColor = ''; }, 500);
            });

            container.appendChild(title);
            container.appendChild(instructions);
            container.appendChild(textarea);
            container.appendChild(addAllButton);

            // --- New Button: Refresh and Clear Queue ---
            const newButton = document.createElement('button');
            newButton.textContent = 'New list';
            newButton.style = `
                position: absolute;
                top: 80px;
                right: 10px;
                padding: 5px 10px;
                background: #007bff;
                color: #fff;
                border: none;
                border-radius: 4px;
                font-size: 11.1px;
                cursor: pointer;
            `;
            newButton.addEventListener('click', () => {
                GM_setValue(STORAGE_KEY, null);
                if (textarea) {
                    textarea.value = '';
                }
                const baseUrl = window.location.href.split('?')[0];
                window.location.href = baseUrl + '?cacheBuster=' + new Date().getTime();
            });
            container.appendChild(newButton);

            container.appendChild(button);
            document.body.appendChild(container);
        }

        createStopButton() {
            // Append the stop button inside the main UI container
            const container = document.getElementById("autoDeleteUI");
            if (!container) return;
            if (document.getElementById("autoDeleteStop")) return;
            const stopBtn = document.createElement('button');
            stopBtn.id = "autoDeleteStop";
            stopBtn.textContent = ' STOP ';
            stopBtn.style = `
                position: absolute;
                top: 18px;
                right: 10px;
                padding: 5px 10px;
                background: #6c757d;
                color: #fff;
                border: none;
                border-radius: 4px;
                font-size: 14px;  /* Adjust this value to match Add All */
                cursor: pointer;
                width: auto;  /* Or set a fixed width if desired */
            `;
            stopBtn.addEventListener('click', () => {
                GM_setValue(STORAGE_KEY, null);
                alert('Auto Delete stopped.');
                console.log("Auto Delete stopped by user.");
                // Force a hard refresh by appending a cache-buster parameter
                const baseUrl = window.location.href.split('?')[0];
                window.location.href = baseUrl + '?cacheBuster=' + new Date().getTime();
            });
            container.appendChild(stopBtn);
        }

        async handleTorrentPage() {
            if (!this.queue || this.isProcessing) return;
            // Update progress on torrent detail pages.
            this.updateProgress();
            // If the current page is a 404 error, assume deletion succeeded.
            if (document.title.includes("404") || document.body.innerText.includes("404: Page Not Found")) {
                console.log("404 detected on torrent page.");
                await this.proceedToNext();
                return;
            }
            this.isProcessing = true;
            try {
                await this.deleteCurrentTorrent();
                await this.proceedToNext();
            } catch (error) {
                console.error('Deletion error:', error);
                alert(`Failed to delete: ${window.location.href}\nError: ${error.message}`);
                await this.proceedToNext();
            }
        }

        async deleteCurrentTorrent() {
            // Click the initial delete button (the outlined "x" icon).
            const initialDeleteBtn = await this.waitForElement('button.form__button--outlined i.fa-times', 5000);
            initialDeleteBtn.closest('button').click();

            // Wait for the deletion dialog to appear.
            let dialog;
            try {
                dialog = await this.waitForElement('dialog[open]', 5000);
            } catch (e) {
                console.warn("Deletion dialog not found. Skipping deletion for this torrent and moving on.", e);
                return;
            }

            const form = dialog.querySelector('form');
            if (!form) {
                throw new Error('Deletion form not found in dialog');
            }
            // Fill in the deletion reason.
            const textarea = form.querySelector('textarea#message');
            if (!textarea) {
                throw new Error('Deletion reason textarea not found');
            }
            textarea.value = REASON_TEXT;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));

            // Ensure the required "bon" field exists and is set to "0".
            let bonInput = form.querySelector('input[name="bon"]');
            if (!bonInput) {
                bonInput = document.createElement('input');
                bonInput.type = 'hidden';
                bonInput.name = 'bon';
                bonInput.value = '0';
                form.appendChild(bonInput);
            } else {
                bonInput.value = '0';
                bonInput.dispatchEvent(new Event('input', { bubbles: true }));
            }

            await this.delay(500);

            // Click the final Delete button within the form.
            const confirmBtn = form.querySelector('button.form__button--filled');
            if (!confirmBtn) {
                throw new Error('Final delete button not found in deletion form');
            }
            await this.delay(DELAY);
            confirmBtn.click();

            await this.waitForNavigation();
        }

        async proceedToNext() {
            // If the page shows a 404 error, process it as a successful deletion.
            if (document.title.includes("404") || document.body.innerText.includes("404: Page Not Found")) {
                console.log("404 detected.");
                const goHomeBtn = document.querySelector('.error__home-link');
                if (goHomeBtn) {
                    console.log("Detected 'Go Home' button. Incrementing index and clicking it.");
                    this.queue.index++;
                    GM_setValue(STORAGE_KEY, this.queue);
                    this.updateProgress();
                    goHomeBtn.click();
                    await this.delay(DELAY);
                    return;
                } else {
                    console.log("404 detected but no 'Go Home' button found. Incrementing index and proceeding.");
                    this.queue.index++;
                    GM_setValue(STORAGE_KEY, this.queue);
                    this.updateProgress();
                }
                // After processing 404, redirect to the next URL.
                if (this.queue.index < this.queue.urls.length) {
                    window.location.href = this.queue.urls[this.queue.index];
                } else {
                    GM_setValue(STORAGE_KEY, null);
                    alert('All torrents deleted successfully!');
                }
                return;
            }
            // If not on a torrent detail page, redirect to the next URL.
            if (!this.isDetailPage()) {
                console.log("Not on torrent detail page. Redirecting to next URL.");
                if (this.queue && this.queue.index < this.queue.urls.length) {
                    window.location.href = this.queue.urls[this.queue.index];
                }
                return;
            }
            // If still on the torrent detail page, wait and reload.
            console.log("Still on torrent detail page. Retrying deletion in 3 seconds...");
            await this.delay(3000);
            window.location.reload();
        }

        async waitForElement(selector, timeout = 10000) {
            const start = Date.now();
            return new Promise((resolve, reject) => {
                const check = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(check);
                        resolve(el);
                    } else if (Date.now() - start > timeout) {
                        clearInterval(check);
                        reject(new Error('Element not found: ' + selector));
                    }
                }, 100);
            });
        }

        async waitForNavigation() {
            return new Promise(resolve => setTimeout(resolve, DELAY));
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // Instantiate our main class
    new TorrentDeleter();

    // --- New: Functionality to add a small "Add" button next to each torrent link ---
    function addButtonToTorrentLinks() {
        // Find all torrent links by class name
        const links = document.querySelectorAll('a.user-uploads__name');
        if (!links.length) return;
        links.forEach(link => {
            // Check if the button was already added
            if (link.parentElement.querySelector('.addToQueueButton')) return;
            // Create the "Add" button
            const btn = document.createElement('button');
            btn.textContent = 'Add';
            btn.className = 'addToQueueButton';
            btn.style.marginLeft = '10px';
            btn.style.fontSize = '12px';
            btn.style.padding = '2px 5px';
            btn.style.cursor = 'pointer';
            // When clicked, append the link's URL to the text area in our UI
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const ui = document.getElementById('autoDeleteUI');
                if (ui) {
                    const textarea = ui.querySelector('textarea');
                    if (textarea) {
                        const url = link.href.trim();
                        // Append URL on a new line; if textarea already has content, ensure it ends with a newline.
                        textarea.value = textarea.value.trim() + (textarea.value.trim() ? "\n" : "") + url + "\n";
                        // Optionally, briefly highlight the text area to signal the addition
                        textarea.style.backgroundColor = '#e2f7d4';
                        setTimeout(() => { textarea.style.backgroundColor = ''; }, 500);
                    } else {
                        alert("Text area not found!");
                    }
                } else {
                    alert("UI container not found!");
                }
            });
            // Append the button right after the link
            link.parentElement.appendChild(btn);
        });
    }

    // Run the button injection when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtonToTorrentLinks);
    } else {
        addButtonToTorrentLinks();
    }
})();
