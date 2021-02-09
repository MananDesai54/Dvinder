import Editor from "react-ace";
// Languages
import "ace-builds/src-min-noconflict/mode-c_cpp";
import "ace-builds/src-min-noconflict/mode-java";
import "ace-builds/src-min-noconflict/mode-javascript";
import "ace-builds/src-min-noconflict/mode-python";

// Themes
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-dreamweaver";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-idle_fingers";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/theme-katzenmilch";
import "ace-builds/src-noconflict/theme-kr_theme";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-merbivore";
import "ace-builds/src-noconflict/theme-merbivore_soft";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-mono_industrial";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-sqlserver";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/theme-xcode";

// External Features
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-beautify";

const AceEditor = () => {
  console.log("Hello");

  return (
    <Editor
      mode="javascript"
      theme="monokai"
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      value="// Hello World!!"
      onChange={(e) => {
        console.log(e);
      }}
      wrapEnabled
      highlightActiveLine
      enableLiveAutocompletion
      enableSnippets
      tabSize={2}
    />
  );
};

export default AceEditor;
