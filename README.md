# Instagram Observer

A modular, cross-browser extension built with **TypeScript** and **Vite** that intercepts client-side network requests (`XMLHttpRequest`) on Instagram Web to inspect, paginate, and extract the complete list of a profile's followers and following.

> **⚠️ Disclaimer:** This project is developed strictly for **educational and research purposes** to demonstrate browser extension architecture, script injection lifecycles, and client-side network interception. It is not affiliated with, maintained by, or endorsed by Meta Platforms, Inc. or Instagram. The author assumes no responsibility for any misuse or violation of third-party Terms of Service.

---

## ✨ Features

* **Cross-Browser Architecture:** Standardized adapter pattern supporting **Chrome**, **Firefox**, **Edge**, and **Opera**.
* **Isolated & Injected Execution:** Uses a content script bridge to dynamically inject typed `web_accessible_resources` into the page execution context.
* **XHR Interception Engine:** Hooks into native `XMLHttpRequest` lifecycles to observe and parse authenticated internal API responses without relying on fragile DOM scraping.
* **Target & Permission-Aware Extraction:** Dynamically resolves profile paths and extracts the full followers and following lists for public profiles and followed private accounts.
* **Modern Developer Tooling:** Configured with Vite for fast bundling, strict TypeScript definitions, ESLint, and Prettier.

---

## 🛠️ Tech Stack

* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Bundler & Tooling:** [Vite](https://vitejs.dev/)
* **Platform:** WebExtensions API (Manifest V3)
* **Core Technique:** `XMLHttpRequest` Prototype Hooking & DOM Script Injection

---

## 📁 Project Structure

```text
instagram-observer/
├── public/
│   ├── manifest.json              # Extension manifest (MV3)
│   ├── popup.html                 # Extension popup interface
│   └── assets/                    # Extension icons (16, 32, 48, 128px)
├── src/
│   ├── api/                       # Instagram API types and payload models
│   ├── core/                      # Prototype augmentations (Array, Map)
│   ├── helpers/                   # Application constants & target route maps
│   ├── services/
│   │   ├── Browser/               # Cross-browser environment resolver
│   │   ├── Script/                # Multi-browser script injection adapters
│   │   └── XhrInterceptor/        # Core network request interceptor logic
│   ├── utils/                     # Helper modules (DOM, path, post, user, async)
│   ├── content.ts                 # Content script bridge
│   └── web.accessible.resource.ts # Page-level injected payload
├── vite.config.ts                 # Vite bundle configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## ⚙️ How It Works

1. **Injection Bridge:** When navigating to Instagram Web, `content.ts` initializes the appropriate browser script adapter (`Chrome`, `Firefox`, `Edge`, or `Opera`) to inject `web.accessible.resource.ts` directly into the page context.
2. **Network Hooking:** `XhrInterceptor` monkey-patches `window.XMLHttpRequest` methods to monitor and intercept outgoing and incoming internal requests.
3. **Path Validation:** `getFirstPathSegment` inspects `location.pathname` to confirm if the active profile handle exists within `userIdNameMap`.
4. **Data Pagination:** Asynchronous extraction utilities (`getAllFollowing` and `getAllFollowers`) paginate through social graph endpoints using the authenticated session.
5. **Console Logging:** Formatted follower and following lists are logged directly to the browser developer console.

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or later recommended)
* `npm`, `pnpm`, or `yarn`

### Installation & Build

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/instagram-observer.git
   cd instagram-observer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure targets in `src/helpers/Constants.ts`:
   ```typescript
   export const userIdNameMap = new Map<string, string>([
     ['target_username', 'Target Display Name']
   ]);
   ```

4. Build the extension bundle:
   ```bash
   npm run build
   ```

---

### Loading the Extension into Your Browser

#### Chromium-Based Browsers (Chrome / Edge / Opera / Brave)
1. Open `chrome://extensions/` (or `edge://extensions/`).
2. Enable **Developer mode** via the toggle in the top-right corner.
3. Click **Load unpacked** and select the generated `dist` folder.

#### Mozilla Firefox
1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**
3. Select the `manifest.json` file inside the `dist` directory.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.