const iconClass = "tech-stack-icon";

/** Small recognizable marks — monochrome so they fit both themes. */
export function TechIcon({
  id,
  className = iconClass,
}: {
  id: string;
  className?: string;
}) {
  switch (id) {
    case "nextjs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-3.5 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-5.5c-.83 0-1.5-.67-1.5-1.5S10.67 7 11.5 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5 1c-.83 0-1.5-.67-1.5-1.5S14.67 8 15.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      );
    case "react":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        </svg>
      );
    case "typescript":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M3 3h18v18H3V3zm9.5 8.5H10v1.2h1.3V18h1.5v-5.3H14v-1.2h-1.5zm4.2 1.9c0-.7.5-1.2 1.4-1.2.7 0 1.2.3 1.5.7l-1 .6c-.1-.2-.3-.4-.6-.4-.3 0-.4.1-.4.3 0 .2.1.3.6.5l.5.2c.9.4 1.3.8 1.3 1.6 0 .9-.7 1.5-1.8 1.5-1 0-1.7-.5-2-1.1l1.1-.6c.2.4.5.6.9.6.3 0 .5-.1.5-.4 0-.2-.1-.4-.6-.6l-.5-.2c-.8-.3-1.3-.8-1.3-1.6z" />
        </svg>
      );
    case "tailwind":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 6c-2.5 0-4.1 1.3-4.7 3.8.9-1.3 2-1.8 3.2-1.6.7.1 1.2.5 1.8 1 1 .9 2.1 1.9 4.5 1.9 2.5 0 4.1-1.3 4.7-3.8-.9 1.3-2 1.8-3.2 1.6-.7-.1-1.2-.5-1.8-1-1-.9-2.1-1.9-4.5-1.9zm-4.7 7.1c-2.5 0-4.1 1.3-4.7 3.8.9-1.3 2-1.8 3.2-1.6.7.1 1.2.5 1.8 1 1 .9 2.1 1.9 4.5 1.9 2.5 0 4.1-1.3 4.7-3.8-.9 1.3-2 1.8-3.2 1.6-.7-.1-1.2-.5-1.8-1-1-.9-2.1-1.9-4.5-1.9z" />
        </svg>
      );
    case "threejs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path strokeLinejoin="round" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
      );
    case "nestjs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.4 2.1c-.3-.1-.6-.1-.9 0C8.2 3.4 3 8.2 3 13.6c0 4.1 2.7 7.4 6.8 8.2.3.1.6 0 .8-.2.2-.2.3-.5.2-.8-.1-.4-.2-.9-.2-1.3 0-1.5.6-2.8 1.6-3.7.3-.3.4-.7.3-1.1-.2-.4-.5-.7-.9-.8-1.6-.4-2.7-1.9-2.7-3.6 0-2.1 1.7-3.8 3.8-3.8s3.8 1.7 3.8 3.8c0 1.7-1.1 3.2-2.7 3.6-.4.1-.7.4-.9.8-.1.4 0 .8.3 1.1 1 .9 1.6 2.2 1.6 3.7 0 .4-.1.9-.2 1.3-.1.3 0 .6.2.8.2.2.5.3.8.2 4.1-.8 6.8-4.1 6.8-8.2 0-5.4-5.2-10.2-8.5-11.5z" />
        </svg>
      );
    case "nodejs":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.1L3.5 7v10L12 21.9 20.5 17V7L12 2.1zm0 1.8l6.7 3.9v7.4L12 19.1l-6.7-3.9V7.8L12 3.9zm-.8 3.6v6.2l.8.5.8-.5V7.5h1.4v6.9c0 .3-.1.5-.4.7l-1.8 1.1c-.2.1-.5.1-.7 0l-1.8-1.1c-.2-.1-.4-.4-.4-.7V7.5h1.5z" />
        </svg>
      );
    case "express":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path strokeLinecap="round" d="M4 12h16" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h4.5a2.5 2.5 0 010 5H7V8zM14 14l3-6 3 6M15.2 12h3.6" />
        </svg>
      );
    case "openai":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M22.3 10.1a5.4 5.4 0 00-.9-5.1 5.5 5.5 0 00-5.9-2.3A5.5 5.5 0 009.2 1a5.5 5.5 0 00-5.2 3.8A5.5 5.5 0 001.7 12a5.4 5.4 0 00.9 5.1 5.5 5.5 0 005.9 2.3A5.5 5.5 0 0014.8 23a5.5 5.5 0 005.2-3.8 5.5 5.5 0 002.3-7.1zm-9.2 10.6c-1.1 0-2.1-.4-2.9-1.1l.1-.1 3.5-2a.4.4 0 00.2-.4v-5l3.1 1.8v3.6a3.6 3.6 0 01-4 3.1zm-8.5-3.6a3.5 3.5 0 01-.4-2.4l.1.1 3.5 2v4l-1.3.7a3.6 3.6 0 01-1.9-4.4zm-1-8.3a3.5 3.5 0 011.8-1.6v4.1a.4.4 0 00.2.4l3.5 2-3.1 1.8-1.3-.7a3.6 3.6 0 01-1.1-6zm14.6 3.3l-3.5-2 3.1-1.8 1.3.7a3.6 3.6 0 01-1 6.9 3.5 3.5 0 01-.1-2.3l.2-.1zm1.9-2.5l-.1-.1-3.5-2v-4l1.3-.7a3.6 3.6 0 012.3 6.8zM8.8 13.1l-3.1-1.8v-3.6a3.6 3.6 0 016.9-1.1l-.1.1-3.5 2a.4.4 0 00-.2.4v4zm1.1-2.3L12 9.5l2.1 1.3v2.5L12 14.6l-2.1-1.3V10.8z" />
        </svg>
      );
    case "langchain":
    case "langgraph":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="6" cy="12" r="2.2" />
          <circle cx="12" cy="6" r="2.2" />
          <circle cx="12" cy="18" r="2.2" />
          <circle cx="18" cy="12" r="2.2" />
          <path d="M8 11.2l2.2-3.4M8 12.8l2.2 3.4M14 8.8l2.2 2.4M14 15.2l2.2-2.4" />
        </svg>
      );
    case "huggingface":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a8.5 8.5 0 00-8.5 8.5c0 1.8.6 3.5 1.5 4.9L4 21l5-1.8c.9.3 1.9.5 3 .5a8.5 8.5 0 000-17zm-2.3 8.2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm4.6 0a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2zm-5.3 3.6c.6 1.2 1.7 2 3 2s2.4-.8 3-2h-6z" />
        </svg>
      );
    case "postgres":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.4 2c-2.2 0-4 .6-5.1 1.5C6 4.3 5.4 5.5 5.4 7v.4C4 8 3 9.4 3 11.2c0 1.4.7 2.6 1.8 3.4-.1.4-.1.8-.1 1.2 0 2.4 1.4 4.1 3.5 5 .7.3 1.5.5 2.3.6v.4c0 .8.4 1.5 1.4 1.9.4.2.8.2 1.2.2.8 0 1.5-.3 1.9-.7.5.4 1.2.7 2 .7.4 0 .8-.1 1.2-.2 1-.4 1.4-1.1 1.4-1.9v-.5c2.2-.6 3.7-2.4 3.7-4.8 0-.3 0-.6-.1-.9 1-.8 1.6-2 1.6-3.3 0-1.7-.9-3.1-2.3-3.8V7c0-1.5-.6-2.7-1.9-3.5C16.4 2.6 14.6 2 12.4 2zm0 1.5c1.9 0 3.4.5 4.2 1.1.7.5 1 1.2 1 2.1v.3c-.8-.3-1.7-.4-2.7-.4H9.7c-.9 0-1.8.1-2.5.4V6.6c0-.9.4-1.6 1.1-2.1.8-.6 2.3-1 4.1-1z" />
        </svg>
      );
    case "aws":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M6.8 11.4l1.5-4.7h1.6l2.4 7.2h-1.6l-.5-1.6H7.4l-.5 1.6H5.4l1.4-2.5zm1.2-1.1h1.7l-.8-2.6-.9 2.6zM13.2 14V6.7h2.1c1.1 0 1.9.2 2.5.7.5.4.8 1.1.8 1.9 0 .6-.2 1.1-.5 1.5-.3.4-.8.7-1.4.8l2.2 2.4h-1.8l-1.9-2.3h-.7V14h-1.3zm1.3-3.4h.8c.5 0 .8-.1 1.1-.3.2-.2.4-.5.4-.9s-.1-.7-.4-.9c-.2-.2-.6-.3-1.1-.3h-.8v2.4zM4.2 17.3c2.3 1.4 5.3 2.2 8.4 2.2 3.4 0 6.6-.9 9.2-2.5.3-.2.6.1.3.4-2.2 2.6-5.7 4.2-9.5 4.2-4 0-7.6-1.7-9.8-4.4-.2-.3.1-.6.4-.4.3.2.7.4 1 .5z" />
        </svg>
      );
    case "docker":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4.4 11.1h2.1v2.1H4.4v-2.1zm2.6 0h2.1v2.1H7v-2.1zm2.6 0h2.1v2.1H9.6v-2.1zm2.6 0h2.1v2.1h-2.1v-2.1zM7 8.5h2.1v2.1H7V8.5zm2.6 0h2.1v2.1H9.6V8.5zm2.6 0h2.1v2.1h-2.1V8.5zm0-2.6h2.1V8h-2.1V5.9zM4 14.8c0 .1 1.1 2.4 5.2 2.4 4.5 0 6.9-2 7.2-2.1.5-.1 1.4-.1 2.3.5.2.1.3 0 .2-.1-.1-.2-.7-1.2-.3-2.2.3-.7 1.1-1.1 1.4-1.2.1 0 .1-.1 0-.1-.9-.1-2.1.2-2.6.5C16.2 10 14 9.5 12.8 9.5H3.8c-.2 0-.3.2-.2.3.3.8.4 1.9.4 2.5 0 .3 0 .7-.1 1.1 0 .2.1.4.1.4z" />
        </svg>
      );
    case "redis":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3L3.5 7.2v1.4L12 12.8l8.5-4.2V7.2L12 3zm0 11.2L3.5 10v1.5L12 15.7l8.5-4.2V10L12 14.2zm0 4.4L3.5 14.4v1.5L12 20l8.5-4.1v-1.5L12 18.6z" />
        </svg>
      );
    case "electron":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      );
    case "open3d":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path strokeLinejoin="round" d="M12 4l7 4v8l-7 4-7-4V8l7-4z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "cpp":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2L3 6.5v11L12 22l9-4.5v-11L12 2zm0 2.2l7 3.5v7.6l-7 3.5-7-3.5V7.7l7-3.5zM9.2 10.2c-.9 1-1.4 2.2-1.4 3.6s.5 2.6 1.4 3.6c.9 1 2.1 1.5 3.5 1.5.7 0 1.4-.1 2-.4v-1.7c-.5.3-1.1.5-1.8.5-1.1 0-2-.4-2.6-1.1-.6-.7-.9-1.6-.9-2.6s.3-1.9.9-2.6c.6-.7 1.5-1.1 2.6-1.1.7 0 1.3.2 1.8.5V8.7c-.6-.3-1.3-.4-2-.4-1.4 0-2.6.5-3.5 1.5zm6.3 2.3h1.2v-1.2h1.2v1.2H20v1.2h-1.3v1.2h-1.2v-1.2h-1.2v-1.2zm0 0" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      );
  }
}
