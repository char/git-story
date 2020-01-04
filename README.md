# git-story

Commit messages tell a story. `git-story` aggregates all commit messages where their lengths exceed a certain threshold, and renders them out onto a pretty website.

Built using [side](https://github.com/half-cambodian-hacker-man/side).

Read the [accompanying blog post.](https://anthony.som.codes/blog/2020-01-04-git-story/)

## Usage

First, install `side`:

```bash
$ deno install side "https://side.alloc.tech/x/main.ts" --allow-read --allow-write --allow-net --allow-run
```

Then, we can set up `git-story`:

```bash
$ git clone "https://github.com/half-cambodian-hacker-man/git-story.git"
$ cd git-story/
$
$ # Add some repositories:
$ ln -s path/to/my-project/.git repos/my-project
$ ln -s path/to/another-project/.git repos/another-project
$
$ side # Build the project
$ (cd build/ && python3 -m http.server) # Locally serve the built static-site.
```
