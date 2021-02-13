import { FC } from "react";
import { Controlled as Editor } from "react-codemirror2";
import "codemirror/lib/codemirror.css";

//themes
import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/abcdef.css";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/ambiance-mobile.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/bespin.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/colorforth.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/erlang-dark.css";
import "codemirror/theme/gruvbox-dark.css";
import "codemirror/theme/hopscotch.css";
import "codemirror/theme/icecoder.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/isotope.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/theme/liquibyte.css";
import "codemirror/theme/lucario.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/material-ocean.css";
import "codemirror/theme/material-palenight.css";
import "codemirror/theme/material.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/mdn-like.css";
import "codemirror/theme/midnight.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/moxer.css";
import "codemirror/theme/neat.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/night.css";
import "codemirror/theme/nord.css";
import "codemirror/theme/oceanic-next.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/theme/paraiso-dark.css";
import "codemirror/theme/paraiso-light.css";
import "codemirror/theme/pastel-on-dark.css";
import "codemirror/theme/railscasts.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/theme/ssms.css";
import "codemirror/theme/the-matrix.css";
import "codemirror/theme/tomorrow-night-bright.css";
import "codemirror/theme/tomorrow-night-eighties.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/twilight.css";
import "codemirror/theme/vibrant-ink.css";
import "codemirror/theme/xq-dark.css";
import "codemirror/theme/xq-light.css";
import "codemirror/theme/yeti.css";
import "codemirror/theme/yonce.css";
import "codemirror/theme/zenburn.css";

//languages
import "codemirror/mode/brainfuck/brainfuck";
import "codemirror/mode/css/css";
import "codemirror/mode/clojure/clojure";
import "codemirror/mode/cobol/cobol";
import "codemirror/mode/clike/clike";
import "codemirror/mode/coffeescript/coffeescript";
import "codemirror/mode/d/d";
import "codemirror/mode/dart/dart";
import "codemirror/mode/django/django";
import "codemirror/mode/dockerfile/dockerfile";
import "codemirror/mode/elm/elm";
import "codemirror/mode/erlang/erlang";
import "codemirror/mode/fortran/fortran";
import "codemirror/mode/go/go";
import "codemirror/mode/groovy/groovy";
import "codemirror/mode/haskell/haskell";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/julia/julia";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/nginx/nginx";
import "codemirror/mode/pascal/pascal";
import "codemirror/mode/perl/perl";
import "codemirror/mode/php/php";
import "codemirror/mode/python/python";
import "codemirror/mode/r/r";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/rust/rust";
import "codemirror/mode/sass/sass";
import "codemirror/mode/shell/shell";
import "codemirror/mode/sql/sql";
import "codemirror/mode/stylus/stylus";
import "codemirror/mode/swift/swift";
import "codemirror/mode/vb/vb";
import "codemirror/mode/vbscript/vbscript";
import "codemirror/mode/vue/vue";
import "codemirror/mode/xml/xml";
import "codemirror/mode/yaml/yaml";

//addons
import "codemirror/addon/hint/show-hint";

interface EditorProps {
  onChange?: any;
  value: string;
  language: string;
  theme: string;
  readonly?: boolean;
}

const AceEditor: FC<EditorProps> = (props) => {
  return (
    <Editor
      value={props.value}
      options={{
        mode: props.language,
        theme: props.theme,
        lineNumbers: true,
        lineWrapping: true,
        spellCheck: true,
        autofocus: true,
        readonly: !!props.readonly,
      }}
      onChange={(editor, data, value) => {}}
      onBeforeChange={
        props.onChange
          ? (editor, data, value) => {
              props.onChange(value);
            }
          : () => {}
      }
    />
  );
};

export default AceEditor;
