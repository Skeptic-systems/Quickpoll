<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<div align="center">
<h1> Quickpoll</h1>
</div>
<!-- Project Stats -->
<div align="center">

[![en](https://img.shields.io/badge/lang-en-red.svg)]
[![de](https://img.shields.io/badge/lang-de-yellow.svg)]
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)]

[![Downloads][downloads-status]][downloads-url]
[![Contributors][contributors-status]][contributors-url]
[![GitHub Release][release-status]][release-url]
[![GitHub Issues or Pull Requests][issues-status]][issues-url]
[![License][license-status]][license-url]

</div>
<br />
<div align="center">
  <a href="https://github.com/skeptic-systems/quickpoll">
    <img src="./apps/web/src-tauri/public/dark-logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Quickpoll</h3>

<p align="center">
    A quiz web app, built with Nextjs React, and Shadcn UI.
    <br />
    <br />
    <a href="https://github.com/skeptic-systems/quickpoll/releases/latest">Download</a>
    ·
    <a href="https://github.com/skeptic-systems/quickpoll/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/skeptic-systems/quickpoll/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>

  <img src="./apps/web/src-tauri/public/mock.png" alt="Quickpoll" width="600">

</div>

<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#screenshots">Screenshots</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#whats-inside">What's inside?</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#development">Development</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## Screenshots

<details>
<summary>Click to view screenshots</summary>

### Main Application

![Landingpage](./apps/web/src-tauri/public/mock.png)

### Admin Interface

![Admin Interface](./apps/web/src-tauri/public/mock2.png)

### Create a Quiz

![Create a Quiz](./apps/web/src-tauri/public/mock3.png)

![Create Question Stacks](./apps/web/src-tauri/public/mock4.png)

![Implement Question Stacks](./apps/web/src-tauri/public/mock5.png)

![Qr Code Support](./apps/web/src-tauri/public/mock6.png)

### Multi Language Support

![Multi Language](./apps/web/src-tauri/public/mock7.png)

### Light and Darkmode

![Lightmode](./apps/web/src-tauri/public/mock8.png)



## Usage

### Installation

#### Docker

Use the compose file in the Repository

## What's inside?

This monorepo includes the following packages/apps:

### Apps

- `web`: A [Next.js](https://nextjs.org/) web application that provides project information and status

### Packages

- `orm`: [Prisma](https://www.prisma.io/) wrapper to manage & access the database
- `database`: [Mariadb](https://mariadb.org/) as database
- `phpmyadmin`: [Phpmyadmin](https://www.phpmyadmin.net/) as database management
- `deepl`: [Deepl](https://www.deepl.com/) used for dynamic translation in Quis modules
- `typescript`: [Next JS](https://nextjs.org/) used typeskript framework

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm
- Docker (for local database)

### Development

1. Clone:

```bash
git clone https://github.com/Skeptic-systems/Quickpoll.git
```
2. CD to projekt root:

```bash
cd quickpoll
```

3. Install dependencies:

```bash
pnpm install
```

4. Copy .env file:

```bash
cp env.example .env
cp ./apps/web/env.example .env
```

5. Set up the database:

```bash
# Start the database (requires Docker)
docker compose up -d
```

6. Run the migrations:

```bash
pnpm db:push
```

7. Run the API server:

```bash
pnpm dev
```
### Useful commands

```bash
pnpm db:seed
```

```bash
pnpm db:studio
```

```bash
pnpm build
```

```bash
pnpm pm2
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE.md](LICENSE.md) file for details.


<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

This project was only possible thanks to the amazing open source community, especially:

### Open Source Libraries

- [Phosphor Icons](https://phosphoricons.com/)
- [React Icons](https://react-icons.github.io/react-icons/search)
- [shadcn/ui](https://ui.shadcn.com/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)

[downloads-status]: https://img.shields.io/github/downloads/skeptic-systems/quickpoll/latest/total
[downloads-url]: https://github.com/skeptic-systems/quickpoll/releases/latest
[stars-status]: https://img.shields.io/github/stars/skeptic-systems/quickpoll
[stars-url]: https://github.com/skeptic-systems/quickpoll/stargazers
[release-status]: https://img.shields.io/github/v/release/skeptic-systems/quickpoll
[release-url]: https://github.com/skeptic-systems/quickpoll/releases/latest
[issues-status]: https://img.shields.io/github/issues/skeptic-systems/quickpoll
[issues-url]: https://github.com/skeptic-systems/quickpoll/issues
[license-status]: https://img.shields.io/github/license/skeptic-systems/quickpoll
[license-url]: https://github.com/skeptic-systems/quickpoll/blob/main/LICENSE.md
[typescript-status]: https://img.shields.io/badge/typescript-007ACC?logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[commit-activity-status]: https://img.shields.io/github/commit-activity/m/skeptic-systems/quickpoll
[commit-activity-url]: https://github.com/skeptic-systems/quickpoll/graphs/commit-activity
[last-commit-status]: https://img.shields.io/github/last-commit/skeptic-systems/quickpoll
[last-commit-url]: https://github.com/skeptic-systems/quickpoll/commits/main
[contributors-status]: https://img.shields.io/github/contributors/skeptic-systems/quickpoll
[contributors-url]: https://github.com/skeptic-systems/quickpoll/graphs/contributors
[forks-status]: https://img.shields.io/github/forks/skeptic-systems/quickpoll
[forks-url]: https://github.com/skeptic-systems/quickpoll/network/members