# ai-label-pr

[![CI](https://github.com/ofershap/ai-label-pr/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/ai-label-pr/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GitHub Action that labels your pull requests automatically. Adds size labels (XS through XXL) based on lines changed, and type labels (feature, fix, docs, refactor, test, chore) using AI analysis of the diff.

```yaml
on: pull_request
jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: ofershap/ai-label-pr@v1
        with:
          api-key: ${{ secrets.OPENAI_API_KEY }}
          provider: openai
          model: gpt-4o-mini
```

> Supports OpenAI and Anthropic. Size labels use simple line-count thresholds. Type labels use AI to classify the diff. Just add your API key.

![GitHub Action for automatic PR labeling by size and type](assets/demo.gif)

<sub>Demo built with <a href="https://github.com/ofershap/remotion-readme-kit">remotion-readme-kit</a></sub>

## Why

Labeling PRs by hand is tedious, and most teams either skip it or do it inconsistently. But labels matter: they make it easy to filter PRs by type, spot oversized changes that need extra review, and generate better changelogs. Existing PR labelers use simple rules (line count thresholds), which works for size but can't tell a feature from a refactor. This action combines rule-based size labels with AI-powered type classification. The AI reads the PR title and a sample of the diff, then picks the most fitting type. Each PR gets exactly one size label and one type label.

## How it works

- **Size labels**: based on total lines changed (additions + deletions). Thresholds: XS (<10), S (<50), M (<200), L (<500), XL (<1000), XXL (1000+).
- **Type labels**: AI reads the PR title and diff (first 3000 chars), then picks one type: feature, fix, docs, refactor, test, or chore.

Existing size/type labels are removed before adding the new ones, so each PR gets exactly one of each.

## Inputs

| Input          | Description                             | Default               |
| -------------- | --------------------------------------- | --------------------- |
| `provider`     | AI provider: `openai` or `anthropic`    | `openai`              |
| `model`        | Model to use                            | `gpt-4o-mini`         |
| `api-key`      | API key for the AI provider             | required              |
| `size-labels`  | Apply size labels (XS/S/M/L/XL/XXL)     | `true`                |
| `type-labels`  | Apply type labels using AI              | `true`                |
| `github-token` | GitHub token (defaults to GITHUB_TOKEN) | `${{ github.token }}` |

## Size thresholds

| Label    | Lines changed |
| -------- | ------------- |
| size/XS  | < 10          |
| size/S   | < 50          |
| size/M   | < 200         |
| size/L   | < 500         |
| size/XL  | < 1000        |
| size/XXL | 1000+         |

## Type labels

| Label         | Description                                |
| ------------- | ------------------------------------------ |
| type/feature  | New functionality or capability            |
| type/fix      | Bug fix or error correction                |
| type/docs     | Documentation changes only                 |
| type/refactor | Code restructuring without behavior change |
| type/test     | Adding or updating tests only              |
| type/chore    | Build, CI, dependencies, or maintenance    |

## AI DevOps Suite

Part of the AI DevOps suite:

- **[ai-commit-msg](https://github.com/ofershap/ai-commit-msg)**: AI-generated conventional commit messages
- **[ai-pr-reviewer](https://github.com/ofershap/ai-pr-reviewer)**: AI-powered PR review comments
- **[ai-changelog](https://github.com/ofershap/ai-changelog)**: AI-generated changelogs from merged PRs
- **ai-label-pr**: Auto-label PRs by size and type (this project)

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
npm run lint
```

## Author

**Ofer Shapira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-ofershap-blue?logo=linkedin)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-ofershap-black?logo=github)](https://github.com/ofershap)
[![Portfolio](https://img.shields.io/badge/Portfolio-gitshow.dev-orange)](https://gitshow.dev/ofershap)

## License

MIT © 2026 Ofer Shapira
