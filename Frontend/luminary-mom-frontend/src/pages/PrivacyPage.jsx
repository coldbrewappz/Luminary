// Privacy Policy — kept deliberately short and honest, matching how little the
// app actually collects. Linked from the Footer and from the app's You tab.

function Section({ title, children }) {
  return (
    <section className="mb-11">
      <h2 className="font-serif text-2xl italic font-light text-text-dark mb-4">
        {title}
      </h2>
      <div className="text-sm font-light text-text-mid leading-loose space-y-3">
        {children}
      </div>
    </section>
  )
}

function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center px-6 py-20 border-b border-linen-dark">
        <p className="text-xs uppercase tracking-widest text-text-light mb-5">
          Privacy Policy
        </p>
        <h1 className="font-serif text-5xl italic font-light text-text-dark leading-tight">
          Your trust,<br />kept simple.
        </h1>
        <p className="text-xs text-text-light tracking-wide mt-6">
          Last updated September 15, 2026
        </p>
      </section>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-16">

        {/* The short version */}
        <div className="bg-lavender rounded-sm px-7 py-7 mb-12">
          <p className="text-xs uppercase tracking-widest text-text-light mb-4">
            The short version
          </p>
          <ul className="space-y-2 text-sm font-light text-text-dark leading-loose">
            <li>We collect only your email, password, and the quotes you save or write.</li>
            <li>We never sell your data, show you ads, or track you.</li>
            <li>You can delete your account and everything in it, anytime, right in the app.</li>
          </ul>
        </div>

        <p className="text-sm font-light text-text-mid leading-loose mb-11">
          Luminary Mom (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a small app and website made to be a
          little light for moms. We keep what we collect to the bare minimum, and this page explains
          exactly what that is and how we handle it &mdash; in plain language.
        </p>

        <Section title="What we collect">
          <p>Only two things:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-text-dark font-medium">Your account</span> &mdash; your email
              address and a password. Your password is stored encrypted (hashed); we never see or
              store it in plain text.
            </li>
            <li>
              <span className="text-text-dark font-medium">Your quotes</span> &mdash; the quotes you
              save to your collection and any personal quotes you write in the app.
            </li>
          </ul>
          <p>
            That&rsquo;s it. We don&rsquo;t ask for your name, phone number, location, or payment
            information, because we don&rsquo;t need them.
          </p>
        </Section>

        <Section title="How we use it">
          <p>We use your information only to run the app for you:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To sign you in and keep you signed in.</li>
            <li>To save your collection and show it back to you.</li>
            <li>
              To send you an occasional account or service message if something important comes up.
              We don&rsquo;t send marketing email.
            </li>
          </ul>
        </Section>

        <Section title="What we don't do">
          <ul className="list-disc pl-5 space-y-2">
            <li>We don&rsquo;t sell, rent, or trade your information &mdash; to anyone, ever.</li>
            <li>We don&rsquo;t show you ads.</li>
            <li>We don&rsquo;t use analytics or third-party trackers to follow you around the internet.</li>
          </ul>
        </Section>

        <Section title="Where your data lives">
          <p>
            To run the app, we rely on a few trusted providers that store and process data on our
            behalf:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="text-text-dark font-medium">Supabase</span> &mdash; our database, where
              your account and quotes are stored.
            </li>
            <li>
              <span className="text-text-dark font-medium">Railway</span> &mdash; hosts the app&rsquo;s
              server.
            </li>
            <li>
              <span className="text-text-dark font-medium">Vercel</span> &mdash; hosts this website.
            </li>
          </ul>
          <p>They act as our processors and may not use your data for their own purposes.</p>
        </Section>

        <Section title="Keeping your data safe">
          <p>
            Your password is hashed, and information travels between the app and our servers over an
            encrypted (HTTPS) connection. No system is perfectly secure, but we take reasonable steps
            to protect your information.
          </p>
        </Section>

        <Section title="Deleting your account">
          <p>
            You&rsquo;re in control. You can permanently delete your account at any time from the{' '}
            <span className="text-text-dark font-medium">You</span> tab in the app
            (&ldquo;Delete Account&rdquo;). This removes your account and every quote you&rsquo;ve
            saved or written, for good. Prefer we do it for you? Just email us.
          </p>
        </Section>

        <Section title="Children's privacy">
          <p>
            Luminary Mom is made for adults and isn&rsquo;t directed to children under 13. We
            don&rsquo;t knowingly collect information from children.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we update this policy, we&rsquo;ll change the date at the top of this page. If the
            changes are significant, we&rsquo;ll do our best to let you know.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about your privacy, or want your data deleted? Email us at{' '}
            <a href="mailto:coldbrewapps@yahoo.com" className="text-text-dark underline">
              coldbrewapps@yahoo.com
            </a>{' '}
            and we&rsquo;ll help.
          </p>
        </Section>

      </div>
    </div>
  )
}

export default PrivacyPage
