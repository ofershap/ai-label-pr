import * as core from "@actions/core";
import * as github from "@actions/github";
import { classifyPrType } from "./ai.js";
import {
  ALL_SIZE_LABELS,
  ALL_TYPE_LABELS,
  getSizeLabel,
  type TypeLabel,
} from "./labels.js";

async function getDiff(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  pullNumber: number,
): Promise<string> {
  const { data } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
    mediaType: { format: "diff" },
  });
  return (data as unknown as string) ?? "";
}

async function removeLabels(
  octokit: ReturnType<typeof github.getOctokit>,
  owner: string,
  repo: string,
  issueNumber: number,
  labels: string[],
): Promise<void> {
  for (const label of labels) {
    try {
      await octokit.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: issueNumber,
        name: label,
      });
    } catch {
      // Label may not exist, ignore
    }
  }
}

function normalizeToTypeLabel(raw: string): TypeLabel {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/^type\//, "");
  const match = ALL_TYPE_LABELS.find(
    (l) => l === `type/${normalized}` || l.replace("type/", "") === normalized,
  );
  return match ?? "type/chore";
}

async function run(): Promise<void> {
  try {
    const provider = core.getInput("provider") as "openai" | "anthropic";
    const model = core.getInput("model") || "gpt-4o-mini";
    const apiKey = core.getInput("api-key", { required: true });
    const applySizeLabels =
      core.getInput("size-labels").toLowerCase() === "true";
    const applyTypeLabels =
      core.getInput("type-labels").toLowerCase() === "true";
    const githubToken =
      core.getInput("github-token") || process.env.GITHUB_TOKEN;

    const context = github.context;
    if (!context.payload.pull_request) {
      core.setFailed("This action must run on a pull_request event.");
      return;
    }

    const pr = context.payload.pull_request;
    const pullNumber = pr.number;
    const additions = pr.additions ?? 0;
    const deletions = pr.deletions ?? 0;
    const title = pr.title ?? "";
    const { owner, repo } = context.repo;

    const octokit = github.getOctokit(githubToken ?? "");

    if (applySizeLabels) {
      const sizeLabel = getSizeLabel(additions, deletions);
      await removeLabels(octokit, owner, repo, pullNumber, [
        ...ALL_SIZE_LABELS,
      ]);
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: pullNumber,
        labels: [sizeLabel],
      });
      core.info(`Applied size label: ${sizeLabel}`);
    }

    if (applyTypeLabels) {
      const diff = await getDiff(octokit, owner, repo, pullNumber);
      const rawType = await classifyPrType(
        { provider, model, apiKey },
        title,
        diff,
      );
      const typeLabel = normalizeToTypeLabel(rawType);
      await removeLabels(octokit, owner, repo, pullNumber, [
        ...ALL_TYPE_LABELS,
      ]);
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: pullNumber,
        labels: [typeLabel],
      });
      core.info(`Applied type label: ${typeLabel}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unexpected error occurred");
    }
  }
}

run();
