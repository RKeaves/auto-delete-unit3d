# auto-delete-unit3d

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/rkeaves/auto-delete-unit3d)
[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

---

## Overview

The auto-delete-unit3d userscript automates the deletion of torrent entries on UNIT3D-based trackers.

It processes a user-defined list of torrent URLs sequentially, identifies successful deletions via 404 error pages, and includes a convenient "Add" button for queuing torrent links. Additionally, you can drag and drop the URL directly into the text box to add it to the queue.

To prevent detection and potential blocking, the script incorporates random time intervals between deletion attempts, ensuring a more natural and less predictable deletion pattern.

<img src="https://ptpimg.me/mfl3gv.gif" width="900">

---

## Warning

**This script performs PERMANENT, IRREVERSIBLE deletions of torrent entries.**  
Use at your own risk. By using this software, you acknowledge that:

- There is **NO UNDO** functionality - deleted files cannot be recovered
- You must **VERIFY ALL URLS** before execution
- You accept full responsibility for any data loss
- Accidental deletions will require re-upload
- Proper permissions on tracker sites are required

> **❗ Mandatory Precautions**  
> 1. Test with non-critical torrents first  
> 2. Double-check your URL list before running  
> 3. Maintain backups of important torrent metadata

---

## Table of Contents

- [Warning](#warning)
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration & Limitations](#configuration--limitations)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features

- **Sequential Deletion:** Automatically processes a queue of torrent URLs.
- **404 Error Detection:** Interprets a 404 page as a successful deletion and navigates accordingly.
- **UI Integration:** A floating, responsive UI that lets you paste multiple torrent URLs (one per line).
- **Quick Queueing:** Adds an “Add” button next to torrent links for rapid URL queuing.
- **Stop Functionality:** Easily halt the deletion process at any time.
- **Customizable:** Easily adjust deletion reason text and delay intervals.

---

## Installation

To install auto-delete-unit3d:

1. **Install a Userscript Manager:**
   - [Tampermonkey for Chrome](https://www.tampermonkey.net/)
   - [Greasemonkey for Firefox](https://www.greasespot.net/)

2. **Add the Script:**
   - Visit the [raw script URL](https://github.com/rkeaves/auto-delete-unit3d/raw/main/auto-delete-unit3d.js) and click “Install” in your userscript manager.
   - The script automatically updates via the provided `@updateURL`.

3. **Supported Trackers:**
   - The script is configured for multiple UNIT3D-based trackers including:
     - PSS
     - OE
     - BLU
     - YU-S
     - FNP 
     - AITHER
     - CBR
     - LCD

---

## Usage

1. **Navigating to a Torrent Page:**
   - When you visit a supported torrent page, the script automatically injects a floating UI on the top-right corner.

2. **Queueing Torrents:**
   - Paste one torrent URL per line into the provided textarea.
   - Alternatively, use the “Add” button next to torrent links to quickly append them to the queue.
   - If the "Add" button is not visible, please refresh the page to ensure the script's UI is properly loaded.

3. **Starting the Deletion Process:**
   - Click the **Start Auto Delete** button to begin processing the queued URLs.
   - The script will sequentially navigate to each URL, attempt deletion, and handle 404 detection as confirmation.

4. **Stopping the Process:**
   - Use the **Stop** button in the UI to cancel the operation and clear the queue.

---

## Configuration & Limitations

- **Deletion Reason:**  
  The default deletion reason is set to `"sorry, file deleted !"`. You can modify this by editing the `REASON_TEXT` constant in the script.

- **Delays & Timing:**  
  Adjust the `DELAY` constant to fine-tune wait times between actions.  

- **Permissions:**  
  Ensure you have the necessary permissions on the tracker for deletion operations. Without the required moderator privileges, the script may not execute as expected.
  *Note:* The deletion process requires proper timing; if you lack moderator privileges, deletion might only work during a permitted time frame.
  
---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear messages.
4. Submit a pull request detailing your changes.

For major changes, please open an issue first to discuss what you would like to change.

---

### v1.2.0 - 2025-02-27

![auto-delete-unit3d](https://i.ibb.co/YFzPmxYx/image.png)


**Improvements:**
-  **Add All Button** - Instantly queue all torrents from current page
-  **New List Button** - Clear current queue and start fresh list
-  **Progress Tracking** - Real-time progress indicator shows current/total deletions
-  **Enhanced UI**:
  - Better button alignment and styling
  - Added status messages for queue operations
  - Visual feedback when adding URLs
  - Automatic text formatting for pasted/dropped URLs
-  **Technical Improvements**:
  - Increased delay between actions (5000ms) for better reliability
  - Added force refresh functionality
  - Improved 404 detection and handling
  - Enhanced error recovery mechanisms
  - Added troubleshooting note about refreshing if Add buttons don't appear
  - Clearer visual hierarchy in UI instructions

**Code Changes**:
- Added 3 new UI buttons (Add All, New List, Enhanced Stop)
- Implemented queue progress tracking system
- Added textarea auto-formatting rules
- Improved cross-browser compatibility
- Added additional error checking
  
---

## Roadmap

- **Future Enhancements:**
  - Add file deletion functionality.
  - Improve error handling and logging.
  - Extend support to additional UNIT3D trackers.
  - UI/UX improvements based on user feedback.

---

## License

This project is licensed under the [GPL-3.0-or-later](LICENSE).

---
