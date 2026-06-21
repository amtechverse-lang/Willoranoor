export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal">
        Contact
      </h1>
      <div className="prose-article mt-8">
        <p>
          We&apos;d love to hear from you. For editorial inquiries, partnerships,
          or general questions, please reach out to us at:
        </p>
        <p>
          <a href="mailto:hello@willoranoor.com">hello@willoranoor.com</a>
        </p>
        <p>
          For press and media requests, contact{" "}
          <a href="mailto:press@willoranoor.com">press@willoranoor.com</a>.
        </p>
      </div>
    </div>
  );
}
