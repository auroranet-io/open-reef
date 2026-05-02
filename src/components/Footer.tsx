import Link from "next/link";

function FooterLink({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  const cls = "hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors";
  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
  ) : (
    <Link href={href} className={cls}>{label}</Link>
  );
}

export default function Footer() {
  const imprintUrl = process.env.IMPRINT_URL;
  const privacyUrl = process.env.PRIVACY_POLICY_URL;
  const makerName = process.env.MAKER_NAME;
  const makerUrl = process.env.MAKER_URL;

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-1 flex flex-wrap justify-center items-center gap-6 text-xs text-zinc-400">
        <FooterLink href="/docs" label="API Docs" />
        {imprintUrl && <FooterLink href={imprintUrl} label="Imprint" />}
        {privacyUrl && <FooterLink href={privacyUrl} label="Privacy Policy" />}
      </div>
      <p className="text-center text-xs text-zinc-400 pt-4 pb-2 px-4">
        OpenReef is an independent project and is not affiliated with, endorsed by, or associated with OpenClaw, Anthropic, or any of their products.
      </p>
      {makerName && (
        <p className="text-center text-xs text-zinc-400 pb-4">
          Made with ♥ by{" "}
          {makerUrl ? (
            <a href={makerUrl} target="_blank" rel="noopener noreferrer"
              className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              {makerName}
            </a>
          ) : (
            <span>{makerName}</span>
          )}
        </p>
      )}
    </footer>
  );
}
