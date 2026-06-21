interface PageTemplateProps {
  title: string;
  children: React.ReactNode;
}

export function PageTemplate({ title, children }: PageTemplateProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal">{title}</h1>
      <div className="prose-article mt-8 max-w-[65ch] text-lg leading-[1.8]">
        {children}
      </div>
    </div>
  );
}
