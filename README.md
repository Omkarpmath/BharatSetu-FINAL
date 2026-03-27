<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Azure_OpenAI-GPT--4o-0078D4?style=for-the-badge&logo=microsoft-azure" alt="Azure OpenAI" />
  <img src="https://img.shields.io/badge/Languages-22-orange?style=for-the-badge" alt="22 Languages" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<h1 align="center">🇮🇳 BharatSetu</h1>
<h3 align="center"><em>Bridging India's Governance Gap with Multi-Agent AI</em></h3>

<p align="center">
  A multi-agent AI platform where five specialized domain agents collaborate in real-time<br/>
  to deliver unified citizen services across all <strong>22 official Indian languages</strong>.
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Multi-Agent System](#-multi-agent-system)
- [SOS Emergency System](#-sos-emergency-system)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

India's 1.4 billion citizens navigate **4,000+ government schemes** across 39 ministries — most accessible only in English through complex, fragmented portals. **BharatSetu** solves this with a **Council of Five** AI agents that collaborate to deliver civic services, health guidance, scheme matching, financial aid, and legal help through a single voice-first mobile interface.

### Problem

| Challenge | Scale |
|-----------|-------|
| Language barrier | 65% of rural Indians can't access English-only portals |
| Fragmented services | 20+ portals for a single citizen's needs |
| Emergency response gap | 7+ helpline numbers to dial manually |

### Solution

A multi-agent AI system where **Nagarik Mitra** (Civic), **Swasthya Sahayak** (Health), **Yojana Saathi** (Welfare), **Arthik Salahkar** (Finance), and **Vidhi Sahayak** (Legal) share context, debate, and converge to serve citizens in their native language.

---

## ✨ Key Features

### 🤖 Multi-Agent AI Collaboration
- Five specialized domain agents with shared MCP context
- Phi-4 powered intelligent routing with parallel dual-model classification
- Automatic cross-agent handoff with full conversation preservation
- Multi-agent collaboration cards showing confidence scores

### 🗣️ Voice-First in 22 Languages
- Azure Speech Services STT/TTS for all 22 scheduled Indian languages
- Real-time speech recognition with auto-agent routing
- Neural TTS reads responses in the citizen's native language

### 🆘 SOS Emergency Dispatch
- One-touch emergency alert with 3-second long-press activation
- Async fan-out to 7+ responders (Police, Ambulance, Fire, NDRF, Women Helpline, Cyber Crime, Legal Aid)
- ISRO DIGIPIN location encoding for precise emergency geo-tagging
- Real-time GPS tracking during active emergencies
- WhatsApp emergency alert integration

### 📝 AI-Generated Dynamic Forms
- LLM-powered context-specific form generation based on user intent
- Auto-fill from Aadhaar-verified citizen profile
- Required document checklist generation

### 🔒 Enterprise-Grade Resilience
- Triple-fallback LLM chain: Azure OpenAI → GitHub Models GPT-4.1-mini → Demo responses
- Dual Azure deployment round-robin (2× TPM)
- Content safety moderation on every message
- Translation cache + routing cache for sub-100ms repeated queries

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   CITIZEN (22 Languages)                      │
│              Voice / Text / Image / SOS Button                │
└──────────────────────┬───────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
   ┌────────────┐ ┌─────────┐ ┌──────────┐
   │Content     │ │Azure    │ │ISRO      │
   │Safety      │ │Translator│ │DIGIPIN   │
   │Moderation  │ │(22 lang)│ │Geolocation│
   └─────┬──────┘ └────┬────┘ └─────┬────┘
         │             │            │
         └─────────────┼────────────┘
                       ▼
   ┌───────────────────────────────────────────────────────────┐
   │            AGENT ROUTING (Parallel)                        │
   │ Pass 1: Microsoft Phi-4 (GitHub Models) — 5s timeout      │
   │ Pass 2: Local TF-IDF + SVC classifier — fallback          │
   │ Pass 3: Client-side keyword regex — last resort            │
   └──────────────────────┬────────────────────────────────────┘
                          ▼
   ┌───────────────────────────────────────────────────────────┐
   │              COUNCIL OF FIVE AGENTS                        │
   │                                                            │
   │  🏛️ Nagarik Mitra    │  🏥 Swasthya Sahayak               │
   │  📋 Yojana Saathi    │  💰 Arthik Salahkar                │
   │  ⚖️ Vidhi Sahayak    │  🌾 Kisan Mitra                    │
   │                                                            │
   │  Shared MCP Context: Last 8 cross-agent messages           │
   └──────────────────────┬────────────────────────────────────┘
                          ▼
   ┌───────────────────────────────────────────────────────────┐
   │              LLM RESPONSE GENERATION                       │
   │                                                            │
   │  Primary:  Azure OpenAI GPT-4o-mini (Dual Deploy A/B)     │
   │  Fallback: GitHub Models GPT-4.1-mini → GPT-4o            │
   │  Final:    Rich demo responses (never fails)               │
   └───────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 18, Tailwind CSS, Framer Motion |
| **State** | Zustand |
| **AI Models** | Azure OpenAI (GPT-4o-mini), GitHub Models (GPT-4.1-mini, Phi-4) |
| **Translation** | Azure AI Translator, MyMemory API |
| **Speech** | Azure Cognitive Speech Services (STT + Neural TTS) |
| **Safety** | Azure Content Safety |
| **Vision** | Azure Computer Vision / GPT-4o Vision |
| **Charts** | Recharts |
| **Icons** | Lucide React, Material Symbols |
| **Mobile** | Capacitor (Android) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0
- **npm** ≥ 9.0
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Omkarpmath/BharatSetu-FINAL.git
cd bharat_setu

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local with your API keys (see Environment Variables section)

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm start
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

### Required (Core AI)

| Variable | Description | Get it from |
|----------|-------------|-------------|
| `GITHUB_TOKEN` | GitHub Personal Access Token for GPT-4o/GPT-4.1-mini | [GitHub Settings → Developer Settings → Tokens](https://github.com/settings/tokens) |
| `GITHUB_TOKEN_PHI` | Dedicated token for Phi-4 agent routing | Same as above (separate to avoid rate limits) |

### Recommended (Enhanced Features)

| Variable | Description | Get it from |
|----------|-------------|-------------|
| `AZURE_TRANSLATOR_KEY` | Azure AI Translator (22-language support) | [Azure Portal](https://portal.azure.com) |
| `AZURE_TRANSLATOR_REGION` | Translator region (e.g., `centralindia`) | Azure Portal |
| `AZURE_SPEECH_KEY` | Azure Speech Services (STT/TTS) | Azure Portal |
| `AZURE_SPEECH_REGION` | Speech region (e.g., `centralindia`) | Azure Portal |
| `AZURE_CONTENT_SAFETY_KEY` | Azure Content Safety moderation | Azure Portal |
| `AZURE_CONTENT_SAFETY_ENDPOINT` | Content Safety endpoint URL | Azure Portal |

### Optional (SOS & Notifications)

| Variable | Description |
|----------|-------------|
| `SOS_WEBHOOK_POLICE` | Webhook URL for police dispatch |
| `SOS_WEBHOOK_MAHILA` | Webhook URL for women helpline dispatch |
| `SOS_WEBHOOK_CHILDLINE` | Webhook URL for child helpline dispatch |
| `SOS_WEBHOOK_NDRF` | Webhook URL for disaster management dispatch |
| `SOS_WEBHOOK_CYBER` | Webhook URL for cyber crime dispatch |
| `SOS_WEBHOOK_LEGAL` | Webhook URL for legal aid dispatch |
| `FAST2SMS_API_KEY` | Fast2SMS API key for SMS alerts |
| `FAST2SMS_PHONE` | Default SMS recipient number |

### Optional (Azure OpenAI — Alternative to GitHub Models)

| Variable | Description |
|----------|-------------|
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL |
| `AZURE_OPENAI_DEPLOYMENT` | Primary deployment name (e.g., `gpt-4o-mini`) |
| `AZURE_OPENAI_DEPLOYMENT_B` | Secondary deployment for round-robin |

> **Note:** If Azure OpenAI is not configured, the app automatically uses GitHub Models (free tier) as the primary LLM provider.

---

## 📡 API Endpoints

BharatSetu exposes **17 API routes** under `/api/`:

### AI & Agents
| Route | Method | Description |
|-------|--------|-------------|
| `/api/agent` | POST | Multi-agent orchestration — routing + LLM response generation |
| `/api/intelligence/multi-agent` | POST | Phi-4 multi-domain collaboration detection |
| `/api/generate-form` | POST | AI-powered dynamic form schema generation |
| `/api/content-safety` | POST | Azure Content Safety text moderation |
| `/api/vision-chat` | POST | Image/document analysis via AI vision |
| `/api/translate` | POST | Language translation (Azure + MyMemory fallback) |

### Voice
| Route | Method | Description |
|-------|--------|-------------|
| `/api/stt` | POST | Speech-to-text via Azure Speech Services |
| `/api/voice` | POST | Text-to-speech via Azure Neural TTS |

### Services
| Route | Method | Description |
|-------|--------|-------------|
| `/api/grievance` | POST | Civic complaint filing with AI ticket generation |
| `/api/schemes` | GET | Government scheme database search |
| `/api/health` | GET | Health facilities and information |

### SOS Emergency
| Route | Method | Description |
|-------|--------|-------------|
| `/api/sos` | POST | Trigger emergency — creates event + async dispatch |
| `/api/sos/dispatch` | POST | Single responder dispatch (webhook/API) |
| `/api/sos/status` | GET | Poll SOS event and responder status |
| `/api/sos/end` | POST | End active SOS session |
| `/api/sos/sms` | POST | SMS alerts via Fast2SMS / MSG91 |
| `/api/sos/update-location` | POST | Real-time GPS location updates |

---

## 📁 Project Structure

```
bharat_setu/
├── src/
│   ├── app/
│   │   ├── api/                    # 17 API routes
│   │   │   ├── agent/              # Multi-agent orchestration
│   │   │   ├── intelligence/       # Phi-4 multi-agent detection
│   │   │   ├── sos/                # SOS emergency system (6 routes)
│   │   │   ├── stt/                # Speech-to-text
│   │   │   ├── voice/              # Text-to-speech
│   │   │   ├── translate/          # Language translation
│   │   │   ├── generate-form/      # AI form generation
│   │   │   ├── content-safety/     # Content moderation
│   │   │   ├── vision-chat/        # Image analysis
│   │   │   ├── grievance/          # Civic complaints
│   │   │   ├── schemes/            # Scheme database
│   │   │   └── health/             # Health services
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Home page
│   ├── components/
│   │   ├── AgentChat.tsx           # Main multi-agent chat UI
│   │   ├── SOSButton.tsx           # SOS emergency overlay
│   │   ├── BottomNav.tsx           # Navigation with SOS trigger
│   │   ├── ScreenDrawer.tsx        # Screen routing
│   │   ├── VoiceAssistant.tsx      # Voice input handler
│   │   ├── GrievanceForm.tsx       # Civic complaint form
│   │   └── screens/               # Feature-specific screens
│   └── lib/
│       ├── store.ts                # Zustand global state
│       ├── azure-config.ts         # Azure service configuration
│       ├── sos-engine.ts           # SOS dispatch engine
│       ├── digipin.ts              # ISRO DIGIPIN encoder/decoder
│       ├── intelligence.ts         # AI intelligence utilities
│       └── permissions.ts          # Role & karma system
├── public/
│   └── screens/                    # Localized HTML screens (7 pages × 22 languages)
├── .env.local                      # Environment variables (not committed)
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies & scripts
```

---

## 🤖 Multi-Agent System

### How Agent Routing Works

```
User Message → Content Safety → Translation → Classification → Response
                                                    │
                                    ┌───────────────┼───────────────┐
                                    ▼               ▼               ▼
                               Phi-4 (5s)    TF-IDF (3s)     Client Regex
                               (primary)     (fallback)      (last resort)
```

1. **Phi-4 Classification** — Microsoft's Phi-4 model classifies the English-translated query into one of 5 agent domains with a one-shot prompt
2. **Local TF-IDF** — If Phi-4 is slow or unavailable, a scikit-learn TF-IDF + SVC classifier runs locally
3. **Client Keywords** — 200+ regex patterns across 10 Indian scripts match known keywords as the final fallback

### Cross-Agent Context (MCP Pattern)

Every agent receives the last 8 messages from all other agents as `sharedContext`, enabling:
- Seamless conversation continuation across domain switches
- Context-aware responses that reference prior agent interactions
- No information loss during automatic handoffs

---

## 🆘 SOS Emergency System

### Flow

1. **Activation** — Citizen long-presses SOS button (3 seconds)
2. **Location** — GPS coordinates captured + ISRO DIGIPIN code generated
3. **Dispatch** — Async fan-out to 7+ emergency responders simultaneously
4. **Tracking** — Client polls for real-time responder status updates
5. **Recording** — Audio recording starts for evidence preservation

### Supported Responders

| Responder | Number | Webhook Variable |
|-----------|--------|------------------|
| Police Emergency | 100 | `SOS_WEBHOOK_POLICE` |
| Ambulance / EMRI | 108 | `SOS_WEBHOOK_POLICE` |
| Fire Brigade | 101 | `SOS_WEBHOOK_POLICE` |
| Women Helpline | 181 | `SOS_WEBHOOK_MAHILA` |
| Child Helpline | 1098 | `SOS_WEBHOOK_CHILDLINE` |
| Disaster (NDRF) | 1078 | `SOS_WEBHOOK_NDRF` |
| Cyber Crime | 1930 | `SOS_WEBHOOK_CYBER` |
| Legal Aid (NALSA) | — | `SOS_WEBHOOK_LEGAL` |

---

## 🌐 Supported Languages

BharatSetu supports all **22 official languages** of India as defined in the Eighth Schedule:

| | | | |
|---|---|---|---|
| 🇮🇳 Hindi | 🇮🇳 Bengali | 🇮🇳 Telugu | 🇮🇳 Marathi |
| 🇮🇳 Tamil | 🇮🇳 Gujarati | 🇮🇳 Kannada | 🇮🇳 Malayalam |
| 🇮🇳 Punjabi | 🇮🇳 Odia | 🇮🇳 Assamese | 🇮🇳 Urdu |
| 🇮🇳 Maithili | 🇮🇳 Santali | 🇮🇳 Kashmiri | 🇮🇳 Nepali |
| 🇮🇳 Konkani | 🇮🇳 Sindhi | 🇮🇳 Dogri | 🇮🇳 Manipuri |
| 🇮🇳 Bodo | 🇮🇳 Sanskrit | 🇬🇧 English | |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>🇮🇳 BharatSetu — Bridging every citizen to their government, in every language India speaks.</strong>
</p>
