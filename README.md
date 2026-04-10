<a id="readme-top"></a>


[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]
[![Version][version-shield]][releases-url]
[![Build][build-shield]][actions-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/sumit-kr-das/nurogate">
    <img src="https://placehold.co/1200x320/0b1220/e2e8f0?text=NuroGate" alt="NuroGate header image" width="1200" />
  </a>

  <h1 align="center">NuroGate</h1>

  <p align="center">
    Route, secure, and monitor your AI workloads.
    <br />
    <a href="https://github.com/sumit-kr-das/nurogate"><strong>Explore the repo »</strong></a>
    <br />
    <br />
    <a href="#usage">View Demo</a>
    &middot;
    <a href="https://github.com/sumit-kr-das/nurogate/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/sumit-kr-das/nurogate/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li>
      <a href="#installation">Installation</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup">Setup</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## Key Features

- **Multi-provider LLM routing** — adapters for Gemini, Claude, and OpenAI-compatible APIs.
- **OpenAI-compatible gateway** — `/v1/models` and `/v1/chat/completions` for drop-in integrations.
- **API keys + auth** — manage sessions and key lifecycle from a single backend.
- **Usage tracking + credits** — support metering and billing-style flows.
- **Admin-ready dashboard** — a fast UI for keys, usage, and account management.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Tech Stack

[![TypeScript][typescript-shield]][typescript-url]
[![Bun][bun-shield]][bun-url]
[![Elysia][elysia-shield]][elysia-url]
[![React][react-shield]][react-url]
[![Tailwind CSS][tailwind-shield]][tailwind-url]
[![Prisma][prisma-shield]][prisma-url]
[![PostgreSQL][postgres-shield]][postgres-url]
[![Turborepo][turborepo-shield]][turborepo-url]

[![Gemini][gemini-shield]][gemini-url]
[![OpenAI][openai-shield]][openai-url]
[![Anthropic][anthropic-shield]][anthropic-url]
[![Groq][groq-shield]][groq-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

### Prerequisites

- Bun (workspace uses `bun@1.3.5`)
- PostgreSQL (for the `db` package / Prisma client)

### Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/sumit-kr-das/nurogate.git
cd nurogate
bun install
```

2. Create a `.env` file (example values):

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nurogate"
JWT_SECRET="replace-me-with-a-long-random-string"

OPENAI_API_KEY=""
GROQ_API_KEY=""
GEMINI_API_KEY=""
ANTHROPIC_API_KEY=""
DEFAULT_PROVIDER="gemini"

API_SERVER_KEY=""
```

3. Generate Prisma client and run migrations:

```bash
cd packages/db
bunx prisma generate
bunx prisma migrate dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

### Start the backend (Auth, API keys, credits)

```bash
cd apps/server
bun run dev
```

- API: http://localhost:3000

### Start the dashboard

```bash
cd apps/dashboard
bun run dev
```

- Web: http://localhost:3001

### Start the LLM gateway (OpenAI-compatible)

By default this service uses `PORT=3000`, which conflicts with the main backend. Use a separate port:

```bash
cd apps/api-server
PORT=3002 bun run dev
```

Try it:

```bash
curl http://localhost:3002/v1/models
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "feat: add AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

See [LICENSE][license-url] for details.

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/sumit-kr-das/nurogate.svg?style=for-the-badge
[contributors-url]: https://github.com/sumit-kr-das/nurogate/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/sumit-kr-das/nurogate.svg?style=for-the-badge
[forks-url]: https://github.com/sumit-kr-das/nurogate/network/members
[stars-shield]: https://img.shields.io/github/stars/sumit-kr-das/nurogate.svg?style=for-the-badge
[stars-url]: https://github.com/sumit-kr-das/nurogate/stargazers
[issues-shield]: https://img.shields.io/github/issues/sumit-kr-das/nurogate.svg?style=for-the-badge
[issues-url]: https://github.com/sumit-kr-das/nurogate/issues
[license-shield]: https://img.shields.io/github/license/sumit-kr-das/nurogate.svg?style=for-the-badge
[license-url]: https://github.com/sumit-kr-das/nurogate/blob/main/LICENSE
[version-shield]: https://img.shields.io/github/v/release/sumit-kr-das/nurogate.svg?style=for-the-badge&display_name=tag&sort=semver
[releases-url]: https://github.com/sumit-kr-das/nurogate/releases
[build-shield]: https://img.shields.io/github/actions/workflow/status/sumit-kr-das/nurogate/ci.yml?branch=main&style=for-the-badge
[actions-url]: https://github.com/sumit-kr-das/nurogate/actions
[typescript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[bun-shield]: https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white
[bun-url]: https://bun.sh/
[elysia-shield]: https://img.shields.io/badge/Elysia-0F172A?style=for-the-badge
[elysia-url]: https://elysiajs.com/
[react-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev/
[tailwind-shield]: https://img.shields.io/badge/Tailwind%20CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8
[tailwind-url]: https://tailwindcss.com/
[prisma-shield]: https://img.shields.io/badge/Prisma-0C344B?style=for-the-badge&logo=prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[postgres-shield]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[postgres-url]: https://www.postgresql.org/
[turborepo-shield]: https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge
[turborepo-url]: https://turbo.build/repo
[gemini-shield]: https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white
[gemini-url]: https://ai.google.dev/
[openai-shield]: https://img.shields.io/badge/OpenAI-0A0A0A?style=for-the-badge&logo=openai&logoColor=white
[openai-url]: https://platform.openai.com/
[anthropic-shield]: https://img.shields.io/badge/Anthropic-111827?style=for-the-badge&logo=anthropic&logoColor=white
[anthropic-url]: https://www.anthropic.com/
[groq-shield]: https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white
[groq-url]: https://console.groq.com/
