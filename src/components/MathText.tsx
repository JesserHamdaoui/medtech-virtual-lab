"use client";

import React from "react";
import { InlineMath, BlockMath } from "react-katex";

interface MathTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export default function MathText({
  text,
  className = "",
  inline = false,
}: MathTextProps) {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g).filter(Boolean);

  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper className={className}>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const formula = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-2 overflow-x-auto">
              <BlockMath math={formula} />
            </div>
          );
        }

        if (part.startsWith("$") && part.endsWith("$")) {
          const formula = part.slice(1, -1).trim();
          return <InlineMath key={index} math={formula} />;
        }

        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      })}
    </Wrapper>
  );
}
