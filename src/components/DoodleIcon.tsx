/**
 * Hand-drawn doodle icons (ink line-art) used in place of emoji.
 * stroke = currentColor so each icon inherits its surrounding colour.
 */
export type DoodleName =
  | 'home'
  | 'exam'
  | 'book'
  | 'notes'
  | 'trends'
  | 'target'
  | 'medal'
  | 'link'
  | 'gear'
  | 'camp'
  | 'cell'
  | 'plant'
  | 'animal'
  | 'ethology'
  | 'genetics'
  | 'ecology'
  | 'systematics';

const PATHS: Record<DoodleName, JSX.Element> = {
  home: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v8h12v-8" />
      <path d="M10 18v-4h4v4" />
    </>
  ),
  exam: (
    <>
      <path d="M5 19l1-4L16 5l3 3L9 18l-4 1z" />
      <path d="M14 7l3 3" />
    </>
  ),
  book: (
    <>
      <path d="M4 5c3-1 5-1 8 1 3-2 5-2 8-1v13c-3-1-5-1-8 1-3-2-5-2-8-1V5z" />
      <path d="M12 6v13" />
    </>
  ),
  notes: (
    <>
      <path d="M6 4h10l3 3v13H6z" />
      <path d="M9 9h7M9 12h7M9 15h5" />
    </>
  ),
  trends: (
    <>
      <path d="M4 19V5M4 19h16" />
      <path d="M6 15l4-4 3 3 5-6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  medal: (
    <>
      <path d="M9 3l3 6 3-6" />
      <circle cx="12" cy="15" r="5" />
      <path d="M12 13l.8 1.6 1.7.2-1.2 1.2.3 1.7-1.6-.9-1.6.9.3-1.7-1.2-1.2 1.7-.2z" fill="currentColor" stroke="none" />
    </>
  ),
  link: (
    <>
      <path d="M9 13a4 4 0 016 0l-1.5 1.5M15 11a4 4 0 01-6 0l1.5-1.5" />
      <path d="M8.5 15.5l-1 1a3 3 0 01-4-4l2-2a3 3 0 014 0" />
      <path d="M15.5 8.5l1-1a3 3 0 014 4l-2 2a3 3 0 01-4 0" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2" />
    </>
  ),
  camp: (
    <>
      <path d="M12 4l8 15H4z" />
      <path d="M12 9v10" />
      <path d="M9 19l3-4 3 4" />
    </>
  ),
  cell: (
    <>
      <path d="M12 4c4.5 0 8 3.2 8 7.6 0 4.6-3.3 8.4-8 8.4S4 16.2 4 11.6 7.5 4 12 4z" />
      <circle cx="12" cy="12" r="3" />
      <circle cx="8.5" cy="9" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  plant: (
    <>
      <path d="M12 20v-8" />
      <path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6z" />
      <path d="M12 14c0-3-2-5-6-5 0 3 2 5 6 5z" />
    </>
  ),
  animal: (
    <>
      <circle cx="8" cy="9" r="1.6" />
      <circle cx="16" cy="9" r="1.6" />
      <circle cx="6" cy="13" r="1.4" />
      <circle cx="18" cy="13" r="1.4" />
      <path d="M9 17c0-2 1.5-3 3-3s3 1 3 3-1.5 2.5-3 2.5S9 19 9 17z" />
    </>
  ),
  ethology: (
    <>
      <path d="M12 7v10" />
      <path d="M12 9c-1-3-7-4-7 0s5 4 7 2" />
      <path d="M12 9c1-3 7-4 7 0s-5 4-7 2" />
      <path d="M12 13c-1 2-5 3-6 1M12 13c1 2 5 3 6 1" />
    </>
  ),
  genetics: (
    <>
      <path d="M8 4c0 4 8 4 8 8s-8 4-8 8" />
      <path d="M16 4c0 4-8 4-8 8s8 4 8 8" />
      <path d="M9 7h6M9.5 9.5h5M9.5 14.5h5M9 17h6" />
    </>
  ),
  ecology: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c3 2.5 3 13.5 0 16M12 4c-3 2.5-3 13.5 0 16" />
    </>
  ),
  systematics: (
    <>
      <path d="M12 21v-5" />
      <circle cx="12" cy="9" r="5" />
      <path d="M9 8l2 2 4-4" />
    </>
  ),
};

interface Props {
  name: DoodleName;
  size?: number;
  className?: string;
}

export default function DoodleIcon({ name, size = 22, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
