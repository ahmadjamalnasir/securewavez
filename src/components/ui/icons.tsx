
import { LucideProps } from 'lucide-react';

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2C6.5 2 2 6.5 2 12c0 2.3.8 4.5 2.1 6.1.8 1 2 1.8 3 2.5 1.2.7 2.5 1.2 3.9 1.3V11h-3V8.5h3v-2c.1-1.3.9-2.4 2.1-2.9.6-.3 1.2-.4 1.9-.4h3v2.7h-2c-.8-.1-1.5.5-1.6 1.3v1.3h3.3l-.5 2.5h-2.8v11c3.3-.4 6.2-2.4 7.9-5.1 1-1.6 1.7-3.4 1.7-5.4 0-5.5-4.5-10-10-10z" />
    </svg>
  ),
  creditCard: (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  bitcoin: (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m3.94.694-.346 1.97M8.55 15.666l-1.476 8.376M10.325 8.745l1.476-8.376M9.094 3.16 5.86 18.046" />
    </svg>
  ),
  ethereum: (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 2-7 11 7 4 7-4z" />
      <path d="m5 13 7 4 7-4" />
      <path d="M12 22V6" />
    </svg>
  ),
  spinner: (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};
