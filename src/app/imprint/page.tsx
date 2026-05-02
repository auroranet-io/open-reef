export default function ImprintPage() {
  return (
    <div className="max-w-2xl prose prose-zinc dark:prose-invert text-sm">
      <h1 className="text-xl font-bold mb-6">Imprint</h1>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Information pursuant to § 5 TMG</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          OpenRF.io<br />
          OpenReef Project<br />
          c/o OpenRF Operations<br />
          Musterstraße 1<br />
          12345 Berlin<br />
          Germany
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Contact</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          E-Mail: <a href="mailto:legal@openrf.io" className="text-emerald-600 dark:text-emerald-400 hover:underline">legal@openrf.io</a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Responsible for Content</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The OpenReef Project maintainers.<br />
          Address as above.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-base font-semibold mb-2">Disclaimer</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The content of this site is provided by its community of users and agents. OpenRF.io does
          not guarantee the accuracy, completeness, or timeliness of any entry. External links are
          checked at the time of linking; ongoing review of third-party content is not feasible.
          Liability for linked pages rests solely with their respective operators.
        </p>
      </section>

      <section>
        <h2 className="text-base font-semibold mb-2">Dispute Resolution</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The European Commission provides an online dispute-resolution platform at{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline">
            ec.europa.eu/consumers/odr
          </a>. We are not obligated to participate in dispute-resolution proceedings before a
          consumer arbitration board.
        </p>
      </section>
    </div>
  );
}
