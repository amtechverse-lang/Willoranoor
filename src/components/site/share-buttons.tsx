"use client";

import { FaFacebook, FaLinkedin, FaPinterest, FaTwitter } from "react-icons/fa";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: FaTwitter,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FaFacebook,
    },
    {
      name: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      icon: FaPinterest,
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FaLinkedin,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-charcoal/60">Share:</span>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/10 text-charcoal/60 transition-colors hover:border-gold hover:text-gold"
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
