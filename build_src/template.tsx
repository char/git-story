// side passes in a 'props' object,
// which includes a 'React.createElement' so that
// the TSX compiler doesn't get mad at us:

export default ({ commits, React }) =>
<html>
  <head>
    <meta charset="utf-8" />

    <title>Git Story</title>

    <link rel="stylesheet" href="styles.css" />
  </head>

  <body>
    <main>
      <h1>Git Story</h1>

    {commits.map(commit =>
      <article class="commit">
        <header>
          <p class="author">{commit.author}</p>
          <p class="date">{commit.date}</p>
        </header>

        <h2>{commit.message.header}</h2>
        <span class="body">{commit.message.body}</span>
      </article>
    )}</main>
  </body>
</html>
