# Professional Portfolio - Architecture & Privacy

This project is a high-performance, developer-centric portfolio website built with **Vanilla JavaScript**. It features a "Corporate Curiosity" visual identity and includes privacy-first analytics and a client-side AI assistant.

## Architecture

### Stack
-   **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES Modules).
-   **No-Build**: Logic runs directly in the browser. No Webpack/Vite required for basic operation (though can be added for minification).
-   **Data**: JSON files in `/data` serve as the "database".
-   **Services**:
    -   `DataLoader`: Fetches content from JSON files. Supports overrides via `localStorage` for the Admin CMS.
    -   `UIRenderer`: Handles DOM updates mapping data to HTML.
    -   `AuthService` (Mock): In `admin.js`, handles hashed password checks (Client-side demo).

### Key Features
1.  **Data-Driven Content**: All text (About, Projects, Skills) is loaded from JSON.
2.  **Admin CMS**: Access via `/admin.html` (Password: `test`). Allows editing content in the browser. Changes are saved to `localStorage` to persist across reloads (Client-side only).
3.  **Curiosity Engine (AI)**: A RAG-lite client-side search that mimics an AI assistant using `curiosity.json` as knowledge.

## Privacy & Security

> [!IMPORTANT]
> This site is designed with strict privacy principles.

### Analytics (`AnalyticsService.js`)
-   **No IP Tracking**: We do not collect IP addresses.
-   **No Cookies**: Uses `sessionStorage` to track unique sessions per tab open, not persistent cookies.
-   **Data Collected**:
    -   Total visit count.
    -   Device type (Mobile vs Desktop) via UserAgent string.
-   **Storage**: Analytics data is stored in `localStorage` locally. In a production version, this would be an anonymous counter in a database.

### AI Assistant
-   **Local Processing**: Queries are processed in the browser. No data is sent to OpenAI/Perplexity.
-   **Guardrails**: The AI explicitly declines questions about private personal info (address, salary, etc).

## Development

1.  **Run Locally**:
    Since this uses ES Modules (`import/export`), you must run it on a local server (to avoid CORS file:// errors).
    ```bash
    npx serve .
    ```
2.  **Edit Content**:
    -   Go to `http://localhost:3000/admin.html`
    -   Password: `test`
    -   Edit JSON and Save.
    -   Refresh main page to see changes.

## Deployment

-   Ready for **Netlify** or **Vercel**.
-   Just drag and drop the `Portfolio` folder.
-   Ensure `admin.html` is either secured via server-side auth or removed if not needed in production (current auth is client-side only).
