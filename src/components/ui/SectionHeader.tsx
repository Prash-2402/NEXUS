import type { ReactNode } from 'react';
import { SplitText, type SplitSegment } from './SplitText';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: SplitSegment[];
  lead?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  id?: string;
}

export function SectionHeader({ index, label, title, lead, align = 'left', className, id }: SectionHeaderProps) {
  const center = align === 'center';
  return (
    <header className={cn('max-w-3xl', center && 'mx-auto text-center', className)}>
      <p className={cn('eyebrow', center && 'justify-center')} data-reveal>
        <span className="text-ice">{index}</span>
        <span>{label}</span>
      </p>
      <SplitText as="h2" id={id} segments={title} className="heading-lg mt-5" />
      {lead && (
        <p className={cn('lead mt-5 max-w-2xl', center && 'mx-auto')} data-reveal>
          {lead}
        </p>
      )}
    </header>
  );
}
