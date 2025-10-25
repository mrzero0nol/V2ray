# Nautica Reforged

This is a revamped version of the original Nautica project, focusing on improved performance, a modern user interface, and a more streamlined architecture. It's a serverless tunnel application deployed on Cloudflare Workers.

## Key Features

- **Efficient Caching**: Proxy lists are cached for 5 minutes to reduce external requests and improve response times.
- **Modern UI**: A new, futuristic, and interactive user interface built with HTML, CSS, and JavaScript.
- **Integrated Frontend**: The UI is served directly from the Cloudflare Worker, creating a seamless, all-in-one application.
- **All Original Features**: Retains all the core functionalities of the original Nautica, including protocol splitting, API endpoints, and more.

## How to Deploy

To deploy Nautica Reforged, you'll need the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd nautica-reforged
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Log in to Wrangler**:
    ```bash
    npx wrangler login
    ```

4.  **Deploy the Worker**:
    ```bash
    npx wrangler deploy
    ```

    After deployment, Wrangler will provide you with the URL of your worker.

## How to Use

-   **Access the UI**: Simply navigate to the URL of your deployed worker in a web browser.
-   **Get Proxies**: Click the "Get Proxies" button to fetch and display the available proxies.
-   **Search**: Use the search bar to filter proxies by country or organization.
-   **Copy Proxy URL**: Click on any proxy item to copy its URL to your clipboard.

## API Endpoints

The original API endpoints are still available:

-   `/api/v1/sub`: The subscription link. You can use the same query parameters as the original Nautica (`cc`, `port`, `vpn`, `limit`, `format`, `domain`).
-   `/check?target=<ip>:<port>`: To check the health of a proxy.
-   `/api/v1/myip`: To get your IP information.
