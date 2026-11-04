import { siteConfig } from '../config/site';
import { SectionHeader } from './ui/SectionHeader';

const organisers = [
  {
    logo: siteConfig.branding.deptLogo,
    name: siteConfig.departmentName,
    role: 'Host department',
    text: 'Teaching and research in artificial intelligence and data science, and the academic home of NEXUS.',
    logoClass: 'h-16 w-16',
  },
  {
    logo: siteConfig.branding.caadsLogo,
    name: siteConfig.organizingClubFullName,
    role: `${siteConfig.organizingClub} · Organising association`,
    text: 'The student association that plans, builds and runs NEXUS, from the first workshop to the final curtain.',
    logoClass: 'h-12 w-auto',
  },
  {
    logo: siteConfig.branding.christLogo,
    name: siteConfig.institution,
    role: siteConfig.campus,
    text: 'The university campus that hosts every NEXUS event.',
    logoClass: 'h-12 w-auto',
  },
];

export function Organizers() {
  return (
    <section id="organizers" className="section">
      <div className="container-site">
        <SectionHeader index="05" label="Organisers" title={[{ text: 'The people behind' }, { text: 'the orbit.', className: 'text-gradient' }]} />

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] md:grid-cols-3">
          {organisers.map((o) => (
            <article key={o.name} className="flex flex-col bg-ink-950/80 p-8 backdrop-blur-md sm:p-10" data-reveal>
              <div className="flex h-16 items-center">
                <img src={o.logo} alt="" className={`${o.logoClass} object-contain`} loading="lazy" />
              </div>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-label text-fg-faint">{o.role}</p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-fg">{o.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">{o.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
