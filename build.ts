async function* gitRepos(ctx) {
  for (const child of await Deno.readDir(ctx.sourceDir)) {
    try {
      const children = (await Deno.readDir(`${ctx.sourceDir}/${child.name}`))
        .map(info => info.name)
      
      if (!(children.includes("HEAD")
          && children.includes("objects")
          && children.includes("refs"))) {
        continue // Not a git repository, skip it.
      }
      
      yield child.name
    } catch (err) {
      // Not a directory, skip it.
    }
  }
}

function getCommits(output) {
  const commits = [];

  enum ParseMode { HEADER, MESSAGE };
  let mode = ParseMode.MESSAGE;
  let commit = null;

  for (const line of output.split("\n")) {
    const dropPrefix = (prefix) => line.substring(prefix.length, line.length).trim()

    if (mode === ParseMode.MESSAGE) {
      if (line.startsWith("    ")) {
        commit.raw_message += dropPrefix("    ") + "\n";
      }

      if (line.startsWith("commit ")) {
        const commitHash = dropPrefix("commit ");

        if (commit) commits.push(commit);
        commit = { commitHash, raw_message: "" };
        mode = ParseMode.HEADER;
      }
    }

    if (mode === ParseMode.HEADER) {
      if (line.startsWith("Author: "))
        commit.author = dropPrefix("Author: ");
      
      if (line.startsWith("Date: "))
        commit.date = new Date(dropPrefix("Date: "));
      
      if (line.length === 0)
        mode = ParseMode.MESSAGE;
    }
  }

  if (commit) commits.push(commit);
  return commits
}

function parseCommitMessage(rawMessage) {
  const lines = rawMessage.split("\n");

  return {
    header: lines[0],
    body: lines.slice(1).join("\n")
  };
}

import template from "./build_src/template.tsx";

export async function build(side, ctx) {
  const { decodeUTF8 } = side;
  const { renderTemplate } = await side.ext.get("templating");

  let commits = [];

  for await (const repo of gitRepos(ctx)) {
    const gitProcess = Deno.run({
      args: ["git", "log"],
      stdout: "piped",
      cwd: `${ctx.sourceDir}/${repo}`
    });

    const output = await gitProcess.output();
    commits.push(...getCommits(decodeUTF8(output))
      .map(commit => ({
        message: parseCommitMessage(commit.raw_message),
        repo,
        ...commit
      }))
      .filter(commit => commit.message.body.length > 240))    
  }

  commits = commits.sort((a, b) => a.date > b.date ? -1 : 1)

  await ctx.writeText("index.html", 
    await renderTemplate(ctx, template, { commits }))

  await ctx.copy("styles.css")
}
