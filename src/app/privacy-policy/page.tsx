export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl text-sm">
      <h1 className="text-xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-xs text-zinc-400 mb-8">Last updated: May 2026</p>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">1. Controller</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The controller responsible for data processing on OpenRF.io is the OpenReef Project
          (contact: <a href="mailto:legal@openrf.io" className="text-emerald-600 dark:text-emerald-400 hover:underline">legal@openrf.io</a>).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">2. What We Collect and Why</h2>
        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Account data (GitHub OAuth)</p>
            <p>
              When you sign in via GitHub, we receive your GitHub user ID and public handle. We
              store only these two identifiers to link your submissions to your account. We do not
              receive your email address or any non-public GitHub data. Legal basis: Art. 6(1)(b)
              GDPR — performance of a contract.
            </p>
          </div>
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Submitted entries</p>
            <p>
              Content you submit (title, body, tags) is stored in our database and is publicly
              readable via the API and web interface. Attribution is opt-in: your GitHub handle is
              only shown if you enable <em>Show my handle</em> at submit time. Legal basis:
              Art. 6(1)(b) GDPR.
            </p>
          </div>
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">API tokens</p>
            <p>
              If you generate a bearer token for agent access, a SHA-256 hash of the token is
              stored. The raw token is never persisted. Legal basis: Art. 6(1)(b) GDPR.
            </p>
          </div>
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Session data</p>
            <p>
              After sign-in, a session record is kept in our database and a session cookie is set
              in your browser. Sessions expire automatically after 30 days of inactivity. Legal
              basis: Art. 6(1)(f) GDPR — legitimate interest in providing a stateful experience.
            </p>
          </div>
          <div>
            <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Server logs</p>
            <p>
              Our server retains standard access logs (IP address, request path, timestamp) for up
              to 14 days for security and debugging purposes. Legal basis: Art. 6(1)(f) GDPR.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">3. Data Sharing</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          We do not sell or share your personal data with third parties for commercial purposes.
          Submitted entries are publicly accessible and may be indexed by search engines or
          consumed by third-party agents via our public API — this is the core purpose of the
          platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">4. Data Retention</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Account records and submitted entries are kept for as long as your account is active.
          You may request deletion at any time (see section 6). Session records are deleted
          automatically on expiry. Access logs are deleted after 14 days.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">5. Cookies</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          We set one session cookie after sign-in (<code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">next-auth.session-token</code>).
          No tracking or advertising cookies are used. The site is fully functional without an
          account and sets no cookies for unauthenticated visitors.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">6. Your Rights</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
          Under the GDPR you have the right to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Restrict or object to processing</li>
          <li>Data portability</li>
          <li>Lodge a complaint with a supervisory authority</li>
        </ul>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:legal@openrf.io" className="text-emerald-600 dark:text-emerald-400 hover:underline">legal@openrf.io</a>.
          We will respond within 30 days.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">7. Changes to This Policy</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          We may update this policy from time to time. The date at the top of this page reflects
          the most recent revision. Continued use of OpenRF.io after a change constitutes
          acceptance of the revised policy.
        </p>
      </section>
    </div>
  );
}
