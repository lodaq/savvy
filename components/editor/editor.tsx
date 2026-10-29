'use client';

import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import type { EditorProps } from './initialized-editor';

const ForwardRefEditor = dynamic(() => import('./initialized-editor'), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center text-muted-foreground bg-muted/20 border border-border rounded-xl">
      <span className="text-sm">Loading MDX Editor...</span>
    </div>
  ),
});

export const Editor = forwardRef<MDXEditorMethods, EditorProps>((props, ref) => (
  <ForwardRefEditor {...props} editorRef={ref} />
));

Editor.displayName = 'Editor';
export default Editor;
