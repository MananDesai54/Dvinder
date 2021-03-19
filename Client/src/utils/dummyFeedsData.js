import React from "react";

export const stories = [
  {
    stories: [
      {
        id: 1,
        url: "https://picsum.photos/1080/1920",
        type: "image",
      },
      {
        content: () => (
          <div style={contentStyle}>
            <h1>The new version is here.</h1>
            <p>This is the new story.</p>
            <p>Now render React components right into your stories.</p>
            <p>Possibilities are endless, like here - here's a code block!</p>
            <pre>
              <code style={code}>console.log('Hello, world!')</code>
            </pre>
            <p>Or here, an image!</p>
            <br />
            <img
              style={image}
              src="https://images.unsplash.com/photo-1565506737357-af89222625ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"
            />
            <h3>Perfect. But there's more! →</h3>
          </div>
        ),
      },
    ],
  },
];

const image = {
  display: "block",
  maxWidth: "100%",
  borderRadius: 4,
};

const code = {
  background: "#eee",
  padding: "5px 10px",
  borderRadius: "4px",
  color: "#333",
};

const contentStyle = {
  background: "salmon",
  width: "100%",
  padding: 20,
  color: "white",
};
