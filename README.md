# ai-label-pr

[![CI](https://github.com/ofershap/ai-label-pr/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/ai-label-pr/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

GitHub Action that automatically labels your pull requests — size labels (XS through XXL) based on lines changed, and type labels (feature, fix, docs, refactor, test, chore) using AI analysis of the diff.

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

> Tiny, focused GitHub Action. Supports OpenAI and Anthropic. Size labels use simple line-count thresholds; type labels use AI to classify the diff. Zero config for the label schema — just add your API key.

![Demo](assets/demo.gif)

## How it works

- **Size labels** — Based on total lines changed (additions + deletions). Thresholds: XS (&lt;10), S (&lt;50), M (&lt;200), L (&lt;500), XL (&lt;1000), XXL (1000+).
- **Type labels** — AI reads the PR title and diff (first 3000 chars), then picks one type: feature, fix, docs, refactor, test, or chore.

Existing size/type labels are removed before adding the new ones, so each PR gets exactly one size label and one type label.

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
| size/XS  | &lt; 10       |
| size/S   | &lt; 50       |
| size/M   | &lt; 200      |
| size/L   | &lt; 500      |
| size/XL  | &lt; 1000     |
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

Part of the AI DevOps Suite: [ai-commit-msg](https://github.com/ofershap/ai-commit-msg), [ai-pr-reviewer](https://github.com/ofershap), [ai-changelog](https://github.com/ofershap), **ai-label-pr**.

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
npm run lint
```

## Author

Ofer Shapira — [@ofershap](https://github.com/ofershap)

## License

MIT © 2026 Ofer Shapira
