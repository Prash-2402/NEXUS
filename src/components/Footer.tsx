import { ArrowUp, ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '../config/site';

export function Footer() {
  const contacts = [
    {
      icon: Mail,
      label: 'Email',
      value: siteConfig.socials.contactEmail,
      href: `mailto:${siteConfig.socials.contactEmail}`,
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: siteConfig.socials.instagramHandle,
      href: siteConfig.socials.instagramUrl,
    },
    {
      icon: MapPin,
      label: 'Venue',
      value: `${siteConfig.institution}, ${siteConfig.campus}`,
    },
  ];

  return (
    <footer id="contact" className="relative z-10 border-t border-white/[0.07] bg-ink-950/80 backdrop-blur-xl">
      <div className="container-site py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img src={siteConfig.branding.nexusLogo} alt="NEXUS" className="h-12 w-auto" loading="lazy" />
            <p className="mt-5 font-display text-xl text-fg">{siteConfig.tagline}.</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-muted">
              {siteConfig.eventIdentity} by {siteConfig.organizingClub}, {siteConfig.departmentName},{' '}
              {siteConfig.institution}.
            </p>
          </div>

          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-label text-fg-faint">Contact</p>
            <ul className="mt-5 space-y-4">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="group flex items-start gap-3 text-sm text-fg transition-colors hover:text-ice"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-fg-faint" />
                      <span className="break-all">{value}</span>
                      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ) : (
                    <span className="flex items-start gap-3 text-sm text-fg-muted">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-fg-faint" />
                      {value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <p className="font-mono text-[10px] uppercase tracking-label text-fg-faint">Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1">
              {siteConfig.navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-8 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 opacity-80">
            <img src={siteConfig.branding.deptLogo} alt={siteConfig.departmentName} className="h-9 w-9" loading="lazy" />
            <img src={siteConfig.branding.caadsLogo} alt="CAADS" className="h-7 w-auto" loading="lazy" />
            <img src={siteConfig.branding.christLogo} alt={siteConfig.institution} className="h-7 w-auto" loading="lazy" />
          </div>
          <div className="flex items-center justify-between gap-6 text-xs text-fg-faint">
            <span>
              © {new Date().getFullYear()} NEXUS · {siteConfig.organizingClub}
              <span className="mx-2">·</span>
              Planet textures:{' '}
              <a
                href="https://www.solarsystemscope.com/textures/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-fg"
              >
                Solar System Scope
              </a>{' '}
              (
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/20 underline-offset-2 hover:text-fg"
              >
                CC BY 4.0
              </a>
              )
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-fg-muted transition-colors hover:border-white/30 hover:text-fg"
            >
              Back to top
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
