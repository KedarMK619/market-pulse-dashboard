const Disclaimer = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Disclaimer</h1>
        <p className="text-muted-foreground">Last updated: March 2025</p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Project Purpose</h2>
          <p className="text-muted-foreground leading-relaxed">
            MarketPulse is an <span className="font-semibold text-primary">educational and learning project</span> designed to demonstrate modern web development practices, financial data visualization, and API integration. It is not intended for real-world financial decision-making.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Data Accuracy Notice</h2>
          <p className="text-muted-foreground leading-relaxed">
            All market data, stock quotes, company information, and financial metrics displayed on MarketPulse are obtained from third-party data providers. While we strive to ensure accuracy, we make no guarantees regarding the completeness, accuracy, or timeliness of the information. Market data may be delayed or contain errors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Not Financial Advice</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            <span className="font-semibold">IMPORTANT:</span> MarketPulse provides educational information only and should NOT be considered as investment, trading, or financial advice. The insights, analyses, and recommendations displayed are for learning purposes and demonstration only.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Past performance does not guarantee future results. All investments carry risk, including potential loss of principal. Please consult with a qualified financial advisor before making any investment decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">AI-Generated Content Notice</h2>
          <p className="text-muted-foreground leading-relaxed">
            Some market insights and analyses featured on MarketPulse are AI-generated and are provided for educational purposes only. AI-generated content may not be accurate or reliable. Always verify information from multiple sources before relying on it for any decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Data Sources & Credits</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            MarketPulse integrates data from the following third-party providers:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><span className="font-semibold">Alpha Vantage</span> - Real-time and historical stock price data</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><span className="font-semibold">NewsAPI</span> - Financial and market news articles</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><span className="font-semibold">Financial Modeling Prep</span> - Company fundamentals and financial metrics</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Built By</h2>
          <p className="text-muted-foreground leading-relaxed">
            MarketPulse was created by <span className="font-semibold">Kedar MK</span> as a learning project to demonstrate full-stack development capabilities, financial data integration, and modern UI/UX design patterns.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-3">Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the fullest extent permitted by law, the creators and maintainers of MarketPulse shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of or reliance on the information provided on this platform.
          </p>
        </section>

        <section className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground italic">
            By using MarketPulse, you acknowledge that you have read and understood this disclaimer and agree to its terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Disclaimer;
