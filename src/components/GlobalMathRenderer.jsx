"use client";

import { useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

export default function GlobalMathRenderer() {
  useEffect(() => {
    const renderAllMath = () => {
      // Saare \( \) aur \[ \] wale equations ko find karo aur render karo
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const nodesToReplace = [];
      let node;

      // Step 1: Saare text nodes collect karo jo math content hai
      while ((node = walker.nextNode())) {
        const text = node.textContent;
        if (
          text &&
          (text.includes("\\(") || text.includes("\\[") || text.includes("$$"))
        ) {
          nodesToReplace.push(node);
        }
      }

      // Step 2: Har text node ko process karo
      nodesToReplace.forEach((textNode) => {
        let html = textNode.textContent;

        // Display Math: \[ ... \] ya $$ ... $$
        html = html.replace(
          /\\\[([\s\S]?)\\\]|\$\$([\s\S]?)\$\$/g,
          (match, latex1, latex2) => {
            const latex = (latex1 || latex2).trim();
            try {
              return `<span class="katex-display-wrapper">${katex.renderToString(
                latex,
                {
                  displayMode: true,
                  throwOnError: false,
                  strict: false,
                }
              )}</span>`;
            } catch (e) {
              console.error("KaTeX display error:", e, latex);
              return match;
            }
          }
        );

        // Inline Math: \( ... \) ya $ ... $
        html = html.replace(
          /\\\(([\s\S]?)\\\)|\$([^\$\s][^\$]?[^\$\s])\$/g,
          (match, latex1, latex2) => {
            const latex = (latex1 || latex2).trim();
            try {
              return katex.renderToString(latex, {
                displayMode: false,
                throwOnError: false,
                strict: false,
              });
            } catch (e) {
              console.error("KaTeX inline error:", e, latex);
              return match;
            }
          }
        );

        // Agar changes hue hain to replace karo
        if (html !== textNode.textContent) {
          const span = document.createElement("span");
          span.innerHTML = html;
          textNode.parentNode.replaceChild(span, textNode);
        }
      });
    };

    // Initial render
    const timer1 = setTimeout(renderAllMath, 300);

    // Retry for dynamic content
    const timer2 = setTimeout(renderAllMath, 1000);
    const timer3 = setTimeout(renderAllMath, 2000);

    // Observer for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      let shouldRender = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE ||
              node.nodeType === Node.TEXT_NODE
            ) {
              const text = node.textContent || "";
              if (
                text.includes("\\(") ||
                text.includes("\\[") ||
                text.includes("$$")
              ) {
                shouldRender = true;
              }
            }
          });
        }
      });

      if (shouldRender) {
        setTimeout(renderAllMath, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, []);

  return null; // Kuch render nahi karna, sirf background mein kaam karna hai
}
