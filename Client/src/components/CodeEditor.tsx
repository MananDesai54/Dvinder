import { FC } from "react";
import { Controlled as Editor } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/addon/hint/show-hint";

interface EditorProps {
  onChange?: any;
  value: string;
}

const AceEditor: FC<EditorProps> = (props) => {
  return (
    <Editor
      value={props.value}
      options={{
        mode: "xml",
        theme: "material",
        lineNumbers: true,
        lineWrapping: true,
        spellCheck: true,
        autofocus: true,
      }}
      onChange={(editor, data, value) => {}}
      onBeforeChange={(editor, data, value) => {
        props.onChange(value);
      }}
      className="code-editor"
    />
  );
};

export default AceEditor;

// mode="javascript"
// theme="monokai"
// name="UNIQUE_ID_OF_DIV"
// editorProps={{ $blockScrolling: true }}
// defaultValue="// Hello World!!"
// onChange={(text) => props.onChange(text)}
// wrapEnabled
// highlightActiveLine
// enableLiveAutocompletion
// enableSnippets
// tabSize={2}
// width="100%"
