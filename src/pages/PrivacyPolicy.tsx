const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: March 2025</p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            MarketPulse ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            When you sign up or use MarketPulse, we may collect:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><span className="font-semibold">Account Information:</span> Email address and name (optional)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><span className="font-semibold">Preferences:</span> Your watchlist selections and portfolio tracking preferences</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><span className="font-semibold">Usage Data:</span> Pages visited, features used, and interaction patterns (for improving the platform)</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            We use the information we collect to:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Personalize your experience and remember your preferences</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Display your customized watchlist and saved data</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Improve platform features and functionality</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Send service-related announcements (if you opt in)</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Data Sharing</h2>
          <p className="text-muted-foreground leading-relaxed">
            <span className="font-semibold">We never sell, trade, or share your personal information with third parties.</span> Your data is only used to provide and improve our services to you. We may share aggregate, anonymized data with service providers who help us operate the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Cookies & Session Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            MarketPulse uses <span className="font-semibold">basic session cookies only</span> to:
          </p>
          <ul className="space-y-2 text-muted-foreground mt-3">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Keep you logged in to your account</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Remember your watchlist and preferences</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Maintain session state</span>
            </li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            We do not use tracking cookies or third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Data You Do Not Need to Provide</h2>
          <p className="text-muted-foreground leading-relaxed">
            MarketPulse <span className="font-semibold">does not collect</span>:
          </p>
          <ul className="space-y-2 text-muted-foreground mt-3">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Medical or health information</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Social Security numbers or banking credentials</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span>Sensitive personal data beyond what you voluntarily share</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Deleting Your Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you wish to delete your account and all associated data, please contact us at{" "}
            <span className="font-semibold text-primary">privacy@marketpulse-app.com</span>. We will process your request within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date.
          </p>
        </section>

        <section className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Questions about this Privacy Policy? Contact us at privacy@marketpulse-app.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
