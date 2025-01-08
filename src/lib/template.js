const htmlHeader = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Story Renderer</title>
  <style>
  body {
    margin: 0;
    font-size: 12px;
  }
  pre {
    -moz-tab-size:    4; 
    -o-tab-size:      4;
    tab-size:         4;
    margin:0;
    // width: 62em;
    }
    pre.beat:hover, pre.song:hover {
      color: white;
      background: black;
    }
      code {
      white-space:pre;
      border-right: 1px solid black;
      color: white;
      }
    .container {
      display: flex;
    }
      .line-numbers {
        width: 1rem;
        background: black;
      }
        .scene:hover {
          background: red;
        }
    .status {
      color: white;
      background: black;

    }
      .status span {
        background: grey;
        color: black;
      }
    </style>
</head>
<body>
<div class="container">
<code class="line-numbers"> 1</code>
<div class="pages">
`;

const htmlFooter = `
</div>
</div>
</body>
</html>
`;

export {htmlHeader, htmlFooter}