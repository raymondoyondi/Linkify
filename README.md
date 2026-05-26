# 🔗 Linkify

A polished, responsive Link-in-Bio and multi-channel social media management platform. It features real-time clickstream analytics, custom theme presets, dynamic role-based permissions, and automated PDF performance reports.

---

## 🚀 Features

* **Custom Theme Presets** — Personalize landing configurations with beautiful, responsive templates.
* **Real-time Clickstream Analytics** — Monitor user engagement tracking events live.
* **Role-Based Permissions** — Guard internal routes via dynamic user access rules.
* **Automated PDF Reports** — Generate performant, production-ready document downloads.
* **Vite-Powered Frontend** — Enjoy high-performance compilation with hot module replacement (HMR).

---

## 🛠️ Tech Stack

* **Frontend Engine:** TypeScript (99.8%), HTML5
* **Build System:** Vite (`vite.config.ts`)
* **Backend Server:** Node.js with TypeScript (`server.ts`)
* **Package Management:** npm (`package.json`, `package-lock.json`)

---

## 📦 Installation & Setup

Follow these quick commands to set up the repository locally:

### 1. Clone the Repository
```bash
git clone https://github.com
cd Linkify
```

### 2. Set Up Environment Variables
Duplicate the provided example configuration file and fill in your custom credentials:
```bash
cp .env.example .env
```

### 3. Install Project Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
# Start local environment
npm run dev
```

---

## 🗂️ Project Structure

```bash
├── src/               # Main application source code
├── .env.example       # Blueprint configuration template
├── index.html         # Application entry point markup
├── metadata.json      # Structured global application values
├── server.ts          # Core application server engine
├── tsconfig.json      # TypeScript compiler specifications
└── vite.config.ts     # Bundler configuration file
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
