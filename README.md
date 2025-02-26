# auto-delete-unit3d

[![Version](https://img.shields.io/badge/version-1.9.4-blue.svg)](https://github.com/rkeaves/auto-delete-unit3d)
[![License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPL--3.0--or--later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

The auto-delete-unit3d userscript automates the deletion of torrent entries on UNIT3D-based trackers. It processes a user-defined list of torrent URLs sequentially, identifies successful deletions via 404 error pages, and includes a convenient "Add" button for effortlessly queuing torrent links. Additionally, you can drag and drop the URL directly into the text box to add it to the queue. To prevent detection and potential blocking, the script incorporates random time intervals between deletion attempts, ensuring a more natural and less predictable deletion pattern.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration & Limitations](#configuration--limitations)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

auto-delete-unit3d automates torrent deletion on UNIT3D trackers. The script processes a list of torrent URLs sequentially, automatically detects if a torrent has been successfully deleted (via 404 errors), and navigates accordingly. Additionally, it enhances user experience by adding an “Add” button next to torrent links—allowing you to quickly append new URLs to your deletion queue.

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
  *Note:* The deletion process requires proper timing; if you lack moderator privileges, deletion might only work during a permitted time frame.

- **Permissions:**  
  Ensure you have the necessary permissions on the tracker for deletion operations. Without the required moderator privileges, the script may not execute as expected.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear messages.
4. Submit a pull request detailing your changes.

For major changes, please open an issue first to discuss what you would like to change.

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