import type { ReactNode } from 'react';
import type { Difficulty } from '../types';

type TagKind = 'cat' | 'sub' | 'difficulty';

interface TagProps {
  kind: TagKind;
  difficulty?: Difficulty;
  children: ReactNode;
}

export default function Tag({ kind, difficulty, children }: TagProps) {
  const cls =
    kind === 'difficulty'
      ? `tag dif-${difficulty ?? 'core'}`
      : `tag ${kind}`;
  return <span className={cls}>{children}</span>;
}
