import { Select } from "@chakra-ui/react";
import React, { CSSProperties, FC } from "react";

interface LanguageSelectProps {
  onChange: (value: string) => void;
  value: string;
  style?: CSSProperties;
}
const LanguageSelect: FC<LanguageSelectProps> = ({
  onChange,
  value,
  style,
}) => {
  return (
    <Select
      style={{
        width: "95%",
        color: "var(--text-primary)",
        ...style,
      }}
      onChange={(e) => onChange(e.target.value)}
      value={value}
    >
      <option value="brainfuck">brainfuck</option>
      <option value="css">css</option>
      <option value="clike">c/cpp/c#/objective-c</option>
      <option value="clojure">clojure</option>
      <option value="coffeescript">coffeescript</option>
      <option value="cobol">cobol</option>
      <option value="d">d</option>
      <option value="dart">dart</option>
      <option value="django">django</option>
      <option value="dockerfile">dockerfile</option>
      <option value="elm">elm</option>
      <option value="erlang">erlang</option>
      <option value="fortran">fortran</option>
      <option value="go">go</option>
      <option value="groovy">groovy</option>
      <option value="javascript">javascript</option>
      <option value="jsx">jsx</option>
      <option value="julia">julia</option>
      <option value="javascript">kotlin</option>
      <option value="markdown">markdown</option>
      <option value="nginx">nginx</option>
      <option value="pascal">pascal</option>
      <option value="perl">perl</option>
      <option value="php">php</option>
      <option value="python">python</option>
      <option value="r">r</option>
      <option value="ruby">ruby</option>
      <option value="rust">rust</option>
      <option value="sass">sass</option>
      <option value="shell">shell</option>
      <option value="sql">sql</option>
      <option value="stylus">stylus</option>
      <option value="swift">swift</option>
      <option value="javascript">typescript</option>
      <option value="vb">vb</option>
      <option value="vbscript">vbscript</option>
      <option value="vue">vue</option>
      <option value="xml">xml</option>
      <option value="yaml">yaml</option>
    </Select>
  );
};

export default LanguageSelect;
