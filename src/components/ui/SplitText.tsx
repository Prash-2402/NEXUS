import { createElement, Fragment, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface SplitSegment {
  text: string;
  className?: string;
  /** Start this segment on a new line. */
  br?: boolean;
}

interface SplitTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  segments: SplitSegment[];
  className?: string;
  id?: string;
}

/**
 * Wraps each word in a mask so the global reveal can slide words up into place.
 * Screen readers get the plain sentence via aria-label.
 */
export function SplitText({ as = 'h2', segments, className, id }: SplitTextProps) {
  const label = segments.map((s) => s.text).join(' ');
  const children: ReactNode[] = [];

  segments.forEach((seg, si) => {
    if (seg.br && si > 0) children.push(<br key={`br-${si}`} />);
    seg.text.split(' ').forEach((word, wi) => {
      children.push(
        <Fragment key={`${si}-${wi}`}>
          <span className="split-word" aria-hidden="true">
            <span className={seg.className}>{word}</span>
          </span>{' '}
        </Fragment>,
      );
    });
  });

  return createElement(as, { id, className: cn(className), 'aria-label': label, 'data-split': '' }, children);
}
