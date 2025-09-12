# Original Spotify Clone Code

## Purpose

This folder contains the original JavaScript code for the Spotify Clone project. The code in `script.js` is designed to fetch songs directly from local directories by making HTTP requests to list the contents of folders (e.g., `/songs/AlbumName/`). This approach works seamlessly in local development environments where a server can provide directory listings, such as when using VS Code's Live Server extension or similar tools.

However, this method is not compatible with static hosting platforms like GitHub Pages. Static hosts do not generate directory indexes or allow fetching of directory contents via JavaScript, which prevents the original code from functioning properly in such environments.

To address this limitation, the main project has been updated to use a JSON-based approach. Instead of fetching directory listings, the updated code reads from `albums.json`, which contains pre-defined metadata for albums, including song lists, titles, descriptions, and cover images. This allows the project to run on static hosting without relying on server-side directory browsing.

## Method to Use This Original Code

If you want to use this original directory-fetching version (for local development or testing):

1. **Replace the Script**: Copy `orginal-code/script.js` to the root directory, overwriting the existing `script.js`. Ensure the HTML file (`index.html`) references this script.

2. **Run a Local Server with Directory Listing**: The code requires a local server that supports directory browsing. Recommended options:
   - **VS Code Live Server Extension**: Install the "Live Server" extension in VS Code. Open the project folder and click "Go Live" to start the server (typically on `http://127.0.0.1:5500`).
   - **Python HTTP Server**: If you have Python installed, navigate to the project root in the terminal and run:
     ```
     python -m http.server 5500
     ```
     Then open `http://localhost:5500` in your browser.
   - **Other Servers**: Any server that generates HTML directory listings (like Apache with autoindex) will work.

3. **Ensure Directory Structure**: The `songs/` folder should contain subfolders for each album, with `info.JSON` files for metadata and `.mp3` files for songs. The code fetches from these directories dynamically.

4. **Test Locally**: Open the project in your browser via the local server. The code will fetch album folders and songs by parsing the server's directory HTML responses.

**Note**: For deployment on GitHub Pages or other static hosts, revert to the JSON-based `script.js` in the root directory, as this original version will not work due to the lack of directory listing support.
