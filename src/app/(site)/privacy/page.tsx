export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl font-semibold text-charcoal">
        Privacy Policy
      </h1>
      <div className="prose-article mt-8">
        <p>
          WilloraNoor respects your privacy. We collect minimal information
          necessary to operate our website and improve your experience. We do
          not sell personal data to third parties.
        </p>
        <h2>Cookies</h2>
        <p>
          We may use cookies and similar technologies for analytics and site
          functionality. You can control cookie preferences through your browser
          settings.
        </p>
        <h2>Contact</h2>
        <p>
          For privacy-related questions, contact us at{" "}
          <a href="mailto:privacy@willoranoor.com">privacy@willoranoor.com</a>.
        </p>
      </div>
    </div>
  );
}
