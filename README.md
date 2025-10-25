# Nautica Reforged (Single File)

This is a revamped, single-file version of the original Nautica project. It has been optimized for performance, features a modern user interface, and is designed for incredibly easy "copy-paste" deployment.

## Key Features

-   **Zero Dependencies**: The entire application—backend, frontend, and proxy data—is contained in a single `_worker.js` file.
-   **No External Requests**: Proxy lists and other functionalities are embedded, meaning it doesn't rely on external domains to work.
-   **Modern UI**: A futuristic, interactive user interface is served directly from the worker.
-   **Simple Deployment**: No need for Wrangler or any command-line tools. Just copy, paste, and deploy through the Cloudflare dashboard.
-   **All Original Features**: Retains all the core functionalities of the original Nautica, including protocol splitting, API endpoints, and more.

## How to Deploy (Copy-Paste Method)

1.  **Create a Cloudflare Account**: If you don't have one, sign up for a free Cloudflare account.

2.  **Navigate to Workers**: In the Cloudflare dashboard, go to the **Workers & Pages** section in the left sidebar.

3.  **Create a New Worker**:
    *   Click on **Create Application**.
    *   Select **Create Worker**.
    *   Give your worker a unique name (e.g., `my-nautica-reforged`). This will be part of its URL.
    *   Click **Deploy**.

4.  **Edit the Worker Code**:
    *   After deployment, click **Edit code**.
    *   You will see a code editor. **Delete all the existing code** in the editor.
    *   **Copy the entire content** of the `_worker.js` file from this repository.
    *   **Paste it** into the Cloudflare code editor.

5.  **Deploy Your Changes**:
    *   Click **Deploy** in the top right of the editor.

That's it! Your self-contained Nautica Reforged application is now live and can be accessed at the URL provided by Cloudflare (e.g., `https://my-nautica-reforged.your-subdomain.workers.dev`).

## How to Use

-   **Access the UI**: Simply navigate to the URL of your deployed worker in a web browser.
-   **Get Proxies**: Click the "Get Proxies" button to display the available proxies.
-   **Search**: Use the search bar to filter proxies by country or organization.
-   **Copy Proxy URL**: Click on any proxy item to copy its URL to your clipboard.

## API Endpoints

The API endpoints work just like the original:

-   `/api/v1/sub`: The subscription link. You can use query parameters like `cc`, `port`, `vpn`, `limit`, and `format` (`raw`, `v2ray`, `clash`).
-   `/check?target=<ip>:<port>`: To check the health of a proxy.
-   `/api/v1/myip`: To get your IP information.
