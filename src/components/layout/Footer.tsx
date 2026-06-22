import { contacts, footer, site } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <Container className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg font-bold text-accent">{site.name}</p>
          <p className="text-sm text-muted">{site.region}</p>
          <a
            href={contacts.phoneHref}
            className="text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            {contacts.phoneDisplay}
          </a>
          <a
            href={contacts.emailHref}
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            {contacts.email}
          </a>
          <SocialLinks size="sm" />
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4 border-t border-accent/10 pt-6 sm:flex-row">
          <p className="text-sm text-muted">{footer.copyright}</p>
          <ul className="flex flex-wrap justify-center gap-6">
            {footer.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
