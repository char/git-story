// side passes in a 'props' object,
// which includes a 'React.createElement' so that
// the TSX compiler doesn't get mad at us:

export default ({ commits, React }) =>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="styles.css" />
    <title>Git Story</title>
  </head>

  <body>
    <main>
      <h1>git story</h1>

      {commits.map(commit =>
        <article class="commit">
          <header>
            <strong class="project">{commit.repo}</strong>
            <p class="author">{commit.author}</p>
            <p class="date">{commit.date.toISOString().substring(0, 10)}</p>
          </header>

          <h2>{commit.message.header}</h2>
          <span class="body">{commit.message.body}</span>
        </article>
      )}
    </main>
  </body>
</html>
