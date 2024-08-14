import { Fragment } from 'react';

export function TextHighlight(text: string, highlight: string) {
  const clearText = highlight.replace(/\W+/g, ' ');
  const parts = text.split(new RegExp(`(${clearText})`, 'gi')).filter(Boolean);

  return (
    <>
      {parts.map((part, i) => {
        if (part.toLowerCase() === highlight.toLowerCase()) {
          return <mark key={i}>{part}</mark>;
        } else {
          return <Fragment key={i}>{part}</Fragment>;
        }
      })}
    </>
  );
}
