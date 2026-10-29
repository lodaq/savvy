import React from 'react';
import Image from 'next/image';
import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Callout({
  children,
  type = 'info',
  title,
}: {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
}) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-100',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100',
    danger: 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-100',
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    danger: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={cn('my-6 p-4 rounded-xl border flex gap-3', styles[type])}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export const mdxComponents = {
  Callout,
  img: ({ src, alt, ...props }: React.ComponentPropsWithoutRef<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ''}
      className="rounded-xl border border-border my-6 max-h-[500px] w-auto mx-auto object-contain shadow-sm"
      loading="lazy"
      {...props}
    />
  ),
  pre: ({ children, ...props }: React.ComponentPropsWithoutRef<'pre'>) => (
    <pre
      {...props}
      className="my-6 overflow-x-auto rounded-xl bg-muted/80 p-4 text-sm font-mono border border-border"
    >
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.ComponentPropsWithoutRef<'code'>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-mono font-medium text-primary"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={cn(className, 'font-mono text-sm')} {...props}>
        {children}
      </code>
    );
  },
  table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 w-full overflow-y-auto rounded-lg border border-border">
      <table className="w-full text-sm text-left" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
    <th className="bg-muted px-4 py-3 font-semibold text-foreground border-b border-border" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
    <td className="px-4 py-3 border-b border-border/60" {...props}>
      {children}
    </td>
  ),
};
