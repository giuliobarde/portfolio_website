"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { Content, KeyTextField, asLink, LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import Button from "./Button";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";

// Helper function to scroll to a section smoothly
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 100; // Offset for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

// Component for navigation links that handle section scrolling
const NavLink: React.FC<{
  link: LinkField;
  label: string;
  pathname: string;
  onClose?: () => void;
}> = ({ link, label, pathname, onClose }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const linkUrl = asLink(link);
    
    // Handle different link formats
    let urlString = '';
    if (typeof linkUrl === 'string') {
      urlString = linkUrl;
    } else if (linkUrl && typeof linkUrl === 'object' && 'url' in linkUrl) {
      // Check for url property
      const urlValue = (linkUrl as { url?: string }).url;
      if (typeof urlValue === 'string') {
        urlString = urlValue;
      }
    }
    
    // Also check the raw link object for text content (for 'Any' link type)
    if (!urlString && link && typeof link === 'object') {
      if ('link_type' in link && link.link_type === 'Web' && 'url' in link && typeof link.url === 'string') {
        urlString = link.url;
      } else if ('link_type' in link && link.link_type === 'Document' && 'url' in link && typeof link.url === 'string') {
        urlString = link.url;
      } else if ('link_type' in link && link.link_type === 'Any' && 'text' in link && typeof link.text === 'string') {
        // Handle 'Any' link type - the hash link is in the 'text' property
        urlString = link.text;
      } else if ('text' in link && typeof link.text === 'string') {
        // Fallback: check for text property regardless of link_type
        urlString = link.text;
      }
    }
    
    // Check if it's a hash link (starts with #)
    if (urlString.startsWith('#')) {
      e.preventDefault();
      const sectionId = urlString.substring(1); // Remove the #
      scrollToSection(sectionId);
      if (onClose) onClose();
    } else if (urlString.startsWith('/') && !urlString.includes('#')) {
      // Internal link without hash - let it handle normally
      if (onClose) onClose();
    } else if (urlString.includes('#')) {
      // Internal link with hash
      e.preventDefault();
      const [path, hash] = urlString.split('#');
      if (pathname === path || path === window.location.pathname) {
        // Same page, scroll to section
        scrollToSection(hash);
      } else {
        // Different page, navigate then scroll
        window.location.href = urlString;
      }
      if (onClose) onClose();
    } else {
      // External link or empty
      if (onClose) onClose();
    }
  };

  // Extract URL string with better handling of Prismic link formats
  let urlString = '';
  const linkUrl = asLink(link);
  
  if (typeof linkUrl === 'string') {
    urlString = linkUrl;
  } else if (linkUrl && typeof linkUrl === 'object' && 'url' in linkUrl) {
    const urlValue = (linkUrl as { url?: string }).url;
    if (typeof urlValue === 'string') {
      urlString = urlValue;
    }
  }
  
  // Also check raw link object for text/web links
  if (!urlString && link && typeof link === 'object') {
    if ('link_type' in link && link.link_type === 'Web' && 'url' in link && typeof link.url === 'string') {
      urlString = link.url;
    } else if ('link_type' in link && link.link_type === 'Document' && 'url' in link && typeof link.url === 'string') {
      urlString = link.url;
    } else if ('link_type' in link && link.link_type === 'Any' && 'text' in link && typeof link.text === 'string') {
      // Handle 'Any' link type - the hash link is in the 'text' property
      urlString = link.text;
    } else if ('text' in link && typeof link.text === 'string') {
      // Fallback: check for text property regardless of link_type
      urlString = link.text;
    }
  }
  
  const isHashLink = urlString.startsWith('#');
  const isActive = pathname === '/' && isHashLink 
    ? false // Hash links on homepage are handled differently
    : pathname.includes(asLink(link) as string);

  // Always use regular <a> tag for hash links to ensure click handler works
  if (isHashLink) {
    return (
      <a
        href={urlString}
        onClick={handleClick}
        className={clsx(
          "group relative block overflow-hidden rounded px-3 py-2 md:py-1 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 cursor-pointer",
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <span
          className={clsx(
            "absolute inset-0 z-0 h-full rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
            isActive ? "translate-y-6" : "translate-y-8",
          )}
        />
        <span className="relative">{label}</span>
      </a>
    );
  }

  // For non-hash links, use PrismicNextLink but ensure onClick works
  return (
    <PrismicNextLink
      className={clsx(
        "group relative block overflow-hidden rounded px-3 py-2 md:py-1 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2",
      )}
      field={link}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={clsx(
          "absolute inset-0 z-0 h-full rounded bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0",
          isActive ? "translate-y-6" : "translate-y-8",
        )}
      />
      <span className="relative">{label}</span>
    </PrismicNextLink>
  );
};

export default function NavBar({
  settings,
}: {
  settings: Content.SettingsDocument;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-col justify-between rounded-b-lg bg-slate-50 px-4 py-2 md:m-4 md:flex-row md:items-center md:rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between w-full md:w-auto">
            <NameLogo name={settings.data.name} />
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-slate-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
        </div>
        <DesktopMenu settings={settings} pathname={pathname} />
        <MobileMenu 
          settings={settings} 
          pathname={pathname} 
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />
      </ul>
    </nav>
  );
}

function NameLogo({ name }: { name: KeyTextField }) {
  return (
    <Link
      href="/"
      aria-label="Home page"
      className="text-xl font-extrabold tracking-tighter text-slate-900 mono code-style"
    >
      <span className="code-bracket">{"{"}</span>
      {name}
      <span className="code-bracket">{"}"}</span>
    </Link>
  );
}

function DesktopMenu({
  settings,
  pathname,
}: {
  settings: Content.SettingsDocument;
  pathname: string;
}) {
  return (
    <div className="relative z-50 hidden flex-row items-center gap-1 bg-transparent py-0 md:flex">
      {settings.data.nav_item.map(({ link, label }, index) => (
        <React.Fragment key={label || `nav-item-${index}`}>
          <li>
            <NavLink link={link} label={label || ""} pathname={pathname} />
          </li>
          {index < settings.data.nav_item.length - 1 && (
            <span
              className="hidden text-4xl font-thin leading-[0] text-slate-400 md:inline cs-separator"
              aria-hidden="true"
            >
              /
            </span>
          )}
        </React.Fragment>
      ))}
      <li>
        <Button 
            label={settings.data.resume_text} 
            linkField={settings.data.resume_link}
          />
      </li>
    </div>
  );
}

function MobileMenu({
  settings,
  pathname,
  isOpen,
  onClose,
}: {
  settings: Content.SettingsDocument;
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg bg-slate-50 shadow-lg md:hidden">
      <ul className="flex flex-col py-4">
        {settings.data.nav_item.map(({ link, label }) => {
          const linkUrl = asLink(link);
          let urlString = typeof linkUrl === 'string' ? linkUrl : '';
          
          if (typeof linkUrl === 'object' && linkUrl && 'url' in linkUrl) {
            const urlValue = (linkUrl as { url?: string }).url;
            if (typeof urlValue === 'string') {
              urlString = urlValue;
            }
          }
          
          // Handle 'Any' link type where hash is in text property
          if (!urlString && link && typeof link === 'object') {
            if ('link_type' in link && link.link_type === 'Any' && 'text' in link && typeof link.text === 'string') {
              urlString = link.text;
            } else if ('text' in link && typeof link.text === 'string') {
              urlString = link.text;
            }
          }
          
          const isHashLink = urlString.startsWith('#');
          const isActive = pathname === '/' && isHashLink 
            ? false
            : pathname.includes(asLink(link) as string);
          
          return (
            <li key={label}>
              {isHashLink ? (
                <a
                  href={urlString}
                  onClick={(e) => {
                    e.preventDefault();
                    const sectionId = urlString.substring(1);
                    scrollToSection(sectionId);
                    onClose();
                  }}
                  className={clsx(
                    "block px-4 py-3 text-base font-bold text-slate-900 transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-inset",
                    isActive && "bg-yellow-300"
                  )}
                >
                  {label}
                </a>
              ) : (
                <PrismicNextLink
                  className={clsx(
                    "block px-4 py-3 text-base font-bold text-slate-900 transition-colors hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-inset",
                    isActive && "bg-yellow-300"
                  )}
                  field={link}
                  onClick={(e) => {
                    const linkUrl = asLink(link);
                    let urlString = typeof linkUrl === 'string' ? linkUrl : '';
                    
                    if (typeof linkUrl === 'object' && linkUrl && 'url' in linkUrl) {
                      const urlValue = (linkUrl as { url?: string }).url;
                      if (typeof urlValue === 'string') {
                        urlString = urlValue;
                      }
                    }
                    
                    // Handle 'Any' link type where hash is in text property
                    if (!urlString && link && typeof link === 'object') {
                      if ('link_type' in link && link.link_type === 'Any' && 'text' in link && typeof link.text === 'string') {
                        urlString = link.text;
                      } else if ('text' in link && typeof link.text === 'string') {
                        urlString = link.text;
                      }
                    }
                    
                    if (urlString.includes('#')) {
                      e.preventDefault();
                      const [path, hash] = urlString.split('#');
                      if (pathname === path || path === window.location.pathname) {
                        scrollToSection(hash);
                      } else {
                        window.location.href = urlString;
                      }
                    }
                    onClose();
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </PrismicNextLink>
              )}
            </li>
          );
        })}
        <li className="px-4 py-3">
          <Button 
            label={settings.data.resume_text} 
            linkField={settings.data.resume_link}
            className="w-full justify-center"
          />
        </li>
      </ul>
    </div>
  );
}