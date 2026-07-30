"use client";

import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  Backpack,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Church,
  Clock3,
  Compass,
  Copy,
  Download,
  ExternalLink,
  Gift,
  HelpCircle,
  Loader2,
  MapPin,
  MessageCircleHeart,
  Music2,
  Navigation,
  Pause,
  Play,
  Send,
  Share2,
  Shirt,
  Star,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                            EDIT THE DETAILS HERE                           */
/* -------------------------------------------------------------------------- */

const INVITATION = {
  childName: "Kobe Rustyn Mayores",
  shortName: "Kobe",
  eventTitle: "Christening & 1st Birthday",
  invitationLine: "Please join us for a joyful little adventure",
  eventStart: "2027-02-14T12:00:00+08:00",
  eventEnd: "2027-02-14T17:00:00+08:00",
  parents: "The Mayores Family",
  message:
    "Our little explorer is turning one. With grateful hearts, we invite you to celebrate a beautiful day of faith, family, laughter, and adventure-inspired fun.",
  church: {
    name: "Our Lady of Light Parish",
    address: "A. Bonifacio Avenue, Cainta, Rizal, Philippines",
    time: "12:00 PM",
  },
  reception: {
    name: "The Adventure Hall",
    address: "Ortigas Avenue Extension, Cainta, Rizal, Philippines",
    time: "2:00 PM",
  },
  rsvpDeadline: "February 12, 2027",
  rsvpEmail: "your-email@example.com",
  dressCode:
    "Smart casual in sky blue, cream, sage, warm orange, mustard, and soft earthy tones.",
  giftNote:
    "Your presence is the greatest gift. Should you wish to bring something, books, baby essentials, learning toys, or a simple blessing will be warmly appreciated.",
};

const BABY_IMAGE = "/images/kobe.jpg";
const MUSIC_SRC = "/audio/adventure-music.mp3";
const RSVP_ENDPOINT = "";

const PARTY_GALLERY = [
  {
    title: "Adventure party setup",
    description:
      "A warm welcome area with balloons, explorer accents, and a themed backdrop.",
    badge: "Featured",
    icon: "setup",
  },
  {
    title: "Cake and sweets corner",
    description:
      "A dessert station with a birthday cake, sweet treats, and custom labels.",
    badge: "Sweet",
    icon: "cake",
  },
  {
    title: "Balloon and backdrop styling",
    description:
      "A photo-ready corner styled with soft colors, clouds, and party details.",
    badge: "Backdrop",
    icon: "backdrop",
  },
  {
    title: "Souvenirs and giveaways",
    description:
      "Thoughtful take-home tokens prepared for family, friends, and special guests.",
    badge: "Favors",
    icon: "favors",
  },
  {
    title: "Memory table details",
    description:
      "A simple display for keepsakes, framed photos, and meaningful celebration pieces.",
    badge: "Keepsakes",
    icon: "memory",
  },
  {
    title: "Celebration moments",
    description:
      "A joyful program filled with faith, smiles, photos, and shared family memories.",
    badge: "Joy",
    icon: "moments",
  },
] as const;

const GODPARENTS = {
  ninangs: ["Jelaica Mayores", "Juris Zulueta", "Elaine"],
  ninongs: ["Sonny", "Nicoles", "Marky", "Isaac"],
};

const FAQS = [
  {
    question: "What time should guests arrive?",
    answer:
      "Please arrive at least 20 to 30 minutes before the ceremony so everyone can be comfortably seated before it begins.",
  },
  {
    question: "May I bring an additional guest?",
    answer:
      "Please include your complete guest count in the RSVP form. For additional guests beyond the invitation, kindly contact the parents first.",
  },
  {
    question: "Is there a preferred dress code?",
    answer: INVITATION.dressCode,
  },
  {
    question: "Where should I send my RSVP?",
    answer: `Please confirm through the RSVP form on this page on or before ${INVITATION.rsvpDeadline}.`,
  },
] as const;

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

type RsvpFormData = {
  fullName: string;
  attendance: "yes" | "no";
  guestCount: string;
  message: string;
};

type ToastState = {
  message: string;
  tone: "success" | "info" | "error";
} | null;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function calculateCountdown(targetDate: string): Countdown {
  const difference = new Date(targetDate).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
    expired: false,
  };
}

function useCountdown(targetDate: string) {
  const [value, setValue] = useState(() => calculateCountdown(targetDate));

  useEffect(() => {
    setValue(calculateCountdown(targetDate));
    const timer = window.setInterval(
      () => setValue(calculateCountdown(targetDate)),
      1000,
    );

    return () => window.clearInterval(timer);
  }, [targetDate]);

  return value;
}

function formatEventDate(dateString: string) {
  return new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(dateString));
}

function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(dateString));
}

function formatIcsDate(dateString: string) {
  return new Date(dateString)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function buildGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${INVITATION.shortName}'s ${INVITATION.eventTitle}`,
    dates: `${formatIcsDate(INVITATION.eventStart)}/${formatIcsDate(
      INVITATION.eventEnd,
    )}`,
    details: `${INVITATION.message}\n\nCeremony: ${INVITATION.church.name}\nReception: ${INVITATION.reception.name}`,
    location: `${INVITATION.church.name}, ${INVITATION.church.address}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadCalendarFile() {
  const title = `${INVITATION.shortName}'s ${INVITATION.eventTitle}`;
  const description = `${INVITATION.message}\nCeremony: ${INVITATION.church.name}\nReception: ${INVITATION.reception.name}`;
  const location = `${INVITATION.church.name}, ${INVITATION.church.address}`;

  const file = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Creatiq Digital Solutions//Adventure Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@creatiq-invitation`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${formatIcsDate(INVITATION.eventStart)}`,
    `DTEND:${formatIcsDate(INVITATION.eventEnd)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([file], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${INVITATION.shortName.toLowerCase()}-celebration.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function openMap(name: string, address: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name}, ${address}`,
  )}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function SectionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CloudShape({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`} aria-hidden="true">
      <div className="relative h-24 w-44 opacity-80">
        <span className="absolute bottom-0 left-4 h-14 w-32 rounded-full bg-white/90" />
        <span className="absolute bottom-5 left-8 size-16 rounded-full bg-white/95" />
        <span className="absolute bottom-7 left-[4.5rem] size-20 rounded-full bg-white" />
        <span className="absolute bottom-4 right-5 size-14 rounded-full bg-white/95" />
      </div>
    </div>
  );
}

function BalloonCluster({ className = "" }: { className?: string }) {
  const balloons = [
    { color: "#f59e0b", x: 38, y: 4 },
    { color: "#ef4444", x: 12, y: 24 },
    { color: "#22c55e", x: 66, y: 28 },
    { color: "#3b82f6", x: 46, y: 42 },
    { color: "#a855f7", x: 4, y: 54 },
    { color: "#f97316", x: 78, y: 58 },
  ];

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
    >
      <div className="relative h-[180px] w-[140px]">
        {balloons.map((balloon, index) => (
          <span
            key={balloon.color}
            className="absolute rounded-[50%_50%_46%_46%] border border-white/40 shadow-lg"
            style={{
              backgroundColor: balloon.color,
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              width: 38,
              height: 50,
              transform: `rotate(${index % 2 === 0 ? -7 : 7}deg)`,
            }}
          />
        ))}
        {balloons.map((balloon, index) => (
          <span
            key={`${balloon.color}-line`}
            className="absolute h-px origin-left bg-[#7c5b3b]/45"
            style={{
              left: `${balloon.x + 9}%`,
              top: `${balloon.y + 32}%`,
              width: 105,
              transform: `rotate(${82 + index * 3}deg)`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function BadgeSymbol({ symbol }: { symbol: string }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-full border-2 border-[#f4c552] bg-[#f8e3a0] text-lg font-black text-[#1d5a45] shadow-[inset_0_0_0_3px_#ca4b30]">
      {symbol}
    </span>
  );
}

function ScoutBadgeRow() {
  const badges = ["⌂", "✿", "★", "✈", "▲", "✦", "⚑", "☀"];
  const lane = [...badges, ...badges, ...badges, ...badges, ...badges];

  return (
    <div className="overflow-hidden border-y-4 border-[#194f3e] bg-[#163f32] py-2 shadow-inner">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="flex w-max will-change-transform"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-2 pr-2"
            aria-hidden={copy === 1}
          >
            {lane.map((badge, index) => (
              <span
                key={`${copy}-${badge}-${index}`}
                className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#f4c552] bg-[#f8e3a0] text-lg font-black text-[#1d5a45] shadow-[inset_0_0_0_3px_#ca4b30]"
              >
                {badge}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#d4aa5d]/45 bg-[#fff9e9] px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#a15e1e]">
        <Compass className="size-3.5" />
        {kicker}
      </div>
      <h2 className="mt-5 font-serif text-4xl font-black leading-tight text-[#254735] sm:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6e705f] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, rotate: value % 2 === 0 ? -1.5 : 1.5 }}
      className="relative overflow-hidden rounded-2xl border-2 border-[#d7a74c] bg-[#fff7d8] px-3 py-4 text-center shadow-[5px_7px_0_#8a4b29] sm:px-5"
    >
      <span className="absolute -right-3 -top-4 size-12 rounded-full bg-[#f4c75e]/35" />
      <AnimatePresence mode="popLayout">
        <motion.strong
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="relative block font-mono text-2xl font-black text-[#6d361e] sm:text-4xl"
        >
          {String(value).padStart(2, "0")}
        </motion.strong>
      </AnimatePresence>
      <span className="relative mt-1 block text-[9px] font-black uppercase tracking-[0.18em] text-[#a46936] sm:text-[10px]">
        {label}
      </span>
    </motion.div>
  );
}

function GalleryCard({
  title,
  description,
  badge,
  icon,
}: {
  title: string;
  description: string;
  badge?: string;
  icon: "setup" | "cake" | "backdrop" | "favors" | "memory" | "moments";
}) {
  const iconMap = {
    setup: <Backpack className="size-6" />,
    cake: <Gift className="size-6" />,
    backdrop: <CalendarDays className="size-6" />,
    favors: <Users className="size-6" />,
    memory: <Compass className="size-6" />,
    moments: <Clock3 className="size-6" />,
  } as const;

  return (
    <motion.article
      whileHover={{ y: -6, rotate: 0.35 }}
      className="group overflow-hidden rounded-[1.8rem] border-2 border-[#d8bc86] bg-[#fffdf7] shadow-[8px_10px_0_#ad7440]"
    >
      <div className="relative flex aspect-[4/4.2] flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,#dff3fb_0%,#fff7dd_58%,#eef6e4_100%)] p-6">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#f6d56f]/40 blur-2xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#b8e0c0]/35 blur-2xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-[#24523f] text-[#fff1bf] shadow-[4px_5px_0_#ad7440]">
            {iconMap[icon]}
          </div>
          {badge ? (
            <span className="rounded-full bg-[#d45f31] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="relative mt-8">
          <p className="font-serif text-2xl font-black text-[#264f3b]">
            {title}
          </p>
          <p className="mt-3 text-sm leading-7 text-[#6f6b5d]">{description}</p>
        </div>
      </div>
    </motion.article>
  );
}

function LocationCard({
  type,
  title,
  time,
  address,
  icon,
  onMap,
}: {
  type: string;
  title: string;
  time: string;
  address: string;
  icon: ReactNode;
  onMap: () => void;
}) {
  return (
    <motion.article
      whileHover={{ y: -8, rotate: type === "Ceremony" ? -0.5 : 0.5 }}
      className="relative overflow-hidden rounded-[2rem] border-2 border-[#d3b77a] bg-[#fffaf0] p-6 shadow-[10px_12px_0_#b6783f] sm:p-8"
    >
      <div className="absolute -right-12 -top-12 size-40 rounded-full bg-[#cde9f7] opacity-60 blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#214f3e] text-[#fff2bd] shadow-lg">
            {icon}
          </div>
          <span className="rounded-full bg-[#f7d976] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#71441d]">
            {type}
          </span>
        </div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[#b16c32]">
          {time}
        </p>
        <h3 className="mt-2 font-serif text-3xl font-black text-[#264d3b]">
          {title}
        </h3>
        <p className="mt-4 flex items-start gap-3 text-sm leading-6 text-[#746b58]">
          <MapPin className="mt-1 size-4 shrink-0 text-[#bd6a30]" />
          {address}
        </p>
        <button
          type="button"
          onClick={onMap}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d76332] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#b94e24]"
        >
          <Navigation className="size-4" />
          View on Maps
          <ExternalLink className="size-3.5" />
        </button>
      </div>
    </motion.article>
  );
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-[#dbc99d] bg-[#fffaf0] shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <span className="font-bold text-[#314f3e]">{question}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="size-5 text-[#bb6c31]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="border-t border-[#eadfc3] px-5 py-5 text-sm leading-7 text-[#716b5e]">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Stamp({
  className = "",
  label,
}: {
  className?: string;
  label: string;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-full border-2 border-[#c48b43]/45 bg-[#fff1cb]/60 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#99602a] backdrop-blur-sm",
        className,
      )}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}

function PartySparkleLine() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-[#c67b34]">
      {Array.from({ length: 13 }, (_, index) => (
        <span
          key={index}
          className={cn(
            "block rounded-full",
            index % 3 === 0 && "size-2.5 bg-[#d65f31]",
            index % 3 === 1 && "size-3 bg-[#f0be52]",
            index % 3 === 2 && "size-2.5 bg-[#2b5c47]",
          )}
        />
      ))}
    </div>
  );
}

export default function Page() {
  const countdown = useCountdown(INVITATION.eventStart);
  const reduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "yes",
    guestCount: "1",
    message: "",
  });

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const eventDate = useMemo(() => formatEventDate(INVITATION.eventStart), []);
  const shortDate = useMemo(() => formatShortDate(INVITATION.eventStart), []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = muted;
  }, [muted]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function openInvitation() {
    setOpened(true);
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.42;
      await audio.play();
      setPlaying(true);
    } catch {
      setToast({
        tone: "info",
        message:
          "Invitation opened. Add public/audio/adventure-music.mp3 to enable music.",
      });
    }
  }

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
    } catch {
      setToast({
        tone: "error",
        message: "Music file not found inside public/audio/.",
      });
    }
  }

  async function copyText(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ tone: "success", message });
    } catch {
      setToast({ tone: "error", message: "Unable to copy automatically." });
    }
  }

  async function shareInvitation() {
    const shareData = {
      title: `${INVITATION.shortName}'s ${INVITATION.eventTitle}`,
      text: `Join us for ${INVITATION.shortName}'s ${INVITATION.eventTitle} on ${shortDate}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyText(window.location.href, "Invitation link copied.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setToast({ tone: "error", message: "Unable to share the invitation." });
    }
  }

  function openGoogleCalendar() {
    window.open(buildGoogleCalendarUrl(), "_blank", "noopener,noreferrer");
  }

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      event: `${INVITATION.shortName}'s ${INVITATION.eventTitle}`,
      submittedAt: new Date().toISOString(),
    };

    try {
      if (RSVP_ENDPOINT) {
        const response = await fetch(RSVP_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("RSVP submission failed.");
      } else {
        localStorage.setItem(
          `rsvp-${INVITATION.shortName.toLowerCase()}`,
          JSON.stringify(payload),
        );

        const subject = encodeURIComponent(
          `RSVP: ${formData.fullName} — ${INVITATION.shortName}'s celebration`,
        );
        const body = encodeURIComponent(
          [
            `Guest: ${formData.fullName}`,
            `Attendance: ${
              formData.attendance === "yes" ? "Attending" : "Unable to attend"
            }`,
            `Number of guests: ${formData.guestCount}`,
            `Message: ${formData.message || "None"}`,
          ].join("\n"),
        );

        window.location.href = `mailto:${INVITATION.rsvpEmail}?subject=${subject}&body=${body}`;
      }

      setRsvpSuccess(true);
      setToast({ tone: "success", message: "RSVP prepared successfully." });
    } catch {
      setToast({
        tone: "error",
        message: "The RSVP could not be submitted. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function closeRsvp() {
    setRsvpOpen(false);
    window.setTimeout(() => {
      setRsvpSuccess(false);
      setFormData({
        fullName: "",
        attendance: "yes",
        guestCount: "1",
        message: "",
      });
    }, 250);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f1df] text-[#304739] selection:bg-[#f7d976] selection:text-[#51301a]">
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        preload="metadata"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <motion.div
        className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-[#d75f31] via-[#f2bd4b] to-[#2d6b54]"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {!opened ? (
          <motion.section
            key="opening-cover"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(16px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] flex min-h-dvh items-center justify-center overflow-hidden bg-[#bde7f5] px-5"
          >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#9edcf2_0%,#dff4fb_58%,#f7e9c6_100%)]" />
            <CloudShape className="left-[-30px] top-[9%] scale-125" />
            <CloudShape className="right-[-20px] top-[28%] scale-75 opacity-80" />
            <BalloonCluster className="-right-5 -top-5 sm:right-[4%]" />

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg rounded-[2.2rem] border-[3px] border-[#805231] bg-[#fff9e8] p-6 text-center shadow-[12px_15px_0_#805231] sm:p-10"
            >
              <div className="absolute -left-4 top-16 h-8 w-14 -rotate-12 bg-[#f4c95f]/70" />
              <div className="absolute -right-4 bottom-20 h-8 w-14 rotate-12 bg-[#9fc86d]/70" />

              <motion.div
                animate={{ y: [0, -6, 0], rotate: [0, 2, 0, -2, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto flex size-20 items-center justify-center rounded-full border-4 border-[#e0a53d] bg-[#1f5a45] text-[#fff1bd] shadow-lg"
              >
                <Backpack className="size-9" />
              </motion.div>

              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.28em] text-[#b55f2d]">
                A little adventure awaits
              </p>
              <h1 className="mt-4 font-serif text-5xl font-black leading-[0.92] text-[#34543f] sm:text-7xl">
                {INVITATION.shortName}
              </h1>
              <p className="mt-4 text-lg font-bold text-[#8a5730]">
                {INVITATION.eventTitle}
              </p>

              <motion.button
                type="button"
                onClick={openInvitation}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full bg-[#d75f31] px-7 py-4 text-sm font-black text-white shadow-[0_8px_0_#8b3f22]"
              >
                <Play className="ml-0.5 size-4" />
                Open Invitation
              </motion.button>
              <p className="mt-4 text-xs text-[#7d776b]">
                Best viewed with sound on
              </p>
            </motion.div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-2 sm:bottom-7 sm:right-7">
        <motion.button
          type="button"
          onClick={shareInvitation}
          whileHover={{ scale: 1.08, rotate: -5 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Share invitation"
          className="flex size-12 items-center justify-center rounded-full border-2 border-[#d2b77c] bg-[#fff9e8] text-[#2c5c47] shadow-[4px_5px_0_#a86b39]"
        >
          <Share2 className="size-5" />
        </motion.button>
        <motion.button
          type="button"
          onClick={() => setMuted((value) => !value)}
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.94 }}
          aria-label={muted ? "Unmute music" : "Mute music"}
          className="flex size-12 items-center justify-center rounded-full border-2 border-[#d2b77c] bg-[#fff9e8] text-[#2c5c47] shadow-[4px_5px_0_#a86b39]"
        >
          {muted ? (
            <VolumeX className="size-5" />
          ) : (
            <Volume2 className="size-5" />
          )}
        </motion.button>
        <motion.button
          type="button"
          onClick={toggleMusic}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label={playing ? "Pause music" : "Play music"}
          className="flex size-12 items-center justify-center rounded-full border-2 border-[#843e21] bg-[#d75f31] text-white shadow-[4px_5px_0_#843e21]"
        >
          {playing ? (
            <Pause className="size-5" />
          ) : (
            <Play className="ml-0.5 size-5" />
          )}
        </motion.button>
      </div>

      <section className="relative z-10 min-h-dvh overflow-hidden bg-[linear-gradient(180deg,#a9e0f3_0%,#e8f7fb_63%,#f7f1df_100%)] px-5 pb-20 pt-14 sm:px-8 lg:px-12">
        <CloudShape className="-left-14 top-20 scale-150 opacity-80" />
        <CloudShape className="right-[-25px] top-[34%] opacity-75" />
        <CloudShape className="bottom-8 left-[28%] scale-75 opacity-70" />
        <BalloonCluster className="right-[-25px] top-0 sm:right-[2%]" />
        <Stamp
          className="left-[4%] top-[18%] -rotate-12 hidden md:block"
          label="Adventure"
        />
        <Stamp
          className="right-[10%] top-[18%] rotate-6 hidden md:block"
          label="Explore"
        />
        <Stamp
          className="left-[8%] bottom-[14%] rotate-6 hidden md:block"
          label="Celebrate"
        />

        <div className="relative mx-auto grid min-h-[88dvh] max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -44 }}
            animate={opened ? { opacity: 1, x: 0 } : { opacity: 0, x: -44 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="order-2 text-center lg:order-1 lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#de9d40] bg-[#fff4ca] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#9b5722] shadow-[3px_4px_0_#a26635]">
              <Compass className="size-3.5" />
              {INVITATION.invitationLine}
            </div>

            <h1 className="mt-7 font-serif text-[clamp(3.4rem,9vw,8rem)] font-black leading-[0.88] tracking-[-0.04em] text-[#284f3c] [text-shadow:4px_4px_0_#f8e3a3]">
              Christening
              <span className="block text-[#d55f2f]">& 1st Birthday</span>
            </h1>

            <div className="mx-auto mt-7 w-fit -rotate-2 rounded-[1.2rem] border-[3px] border-[#80502d] bg-[#fff8e5] px-6 py-3 shadow-[6px_7px_0_#80502d] lg:mx-0">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#b46a32]">
                Our little explorer
              </p>
              <p className="font-serif text-4xl font-black text-[#315541] sm:text-5xl">
                {INVITATION.childName}
              </p>
            </div>

            <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-[#556a5e] lg:mx-0">
              {INVITATION.message}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <motion.button
                type="button"
                onClick={() => setRsvpOpen(true)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d65f31] px-7 py-4 text-sm font-black text-white shadow-[0_9px_0_#8a3f22] transition hover:bg-[#bd4f25]"
              >
                <MessageCircleHeart className="size-4" />
                Send RSVP
              </motion.button>
              <motion.button
                type="button"
                onClick={() => scrollToId("countdown")}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#345d47] bg-[#fff8df] px-7 py-4 text-sm font-black text-[#345d47] shadow-[0_9px_0_#9c7042]"
              >
                Begin the adventure
                <ChevronDown className="size-4" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 44, scale: 0.94 }}
            animate={
              opened
                ? { opacity: 1, x: 0, scale: 1 }
                : { opacity: 0, x: 44, scale: 0.94 }
            }
            transition={{ duration: 1, delay: 0.35 }}
            className="order-1 mx-auto w-full max-w-[520px] lg:order-2"
          >
            <div className="relative aspect-[4/5]">
              <motion.div
                animate={{ rotate: [1.5, 3, 1.5], y: [0, -7, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-5 rounded-[48%_52%_44%_56%/39%_42%_58%_61%] bg-[#f8d577] shadow-[12px_14px_0_#93522c]"
              />
              <div className="absolute inset-9 overflow-hidden rounded-[47%_53%_43%_57%/39%_43%_57%_61%] border-[10px] border-[#fff7dc] shadow-2xl">
                <img
                  src={BABY_IMAGE}
                  alt="Child portrait for the invitation"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173c2e]/85 to-transparent px-6 pb-7 pt-20 text-center text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffe9a8]">
                    Adventure Party
                  </p>
                  <p className="mt-1 font-serif text-4xl font-black">
                    {INVITATION.shortName}
                  </p>
                </div>
              </div>

              <motion.div
                animate={{ rotate: [-7, -3, -7], y: [0, -5, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -left-3 bottom-12 flex size-20 items-center justify-center rounded-full border-4 border-[#f1cf68] bg-[#235d47] text-[#fff2b8] shadow-[5px_6px_0_#8d4d2c]"
              >
                <Compass className="size-9" />
              </motion.div>

              <motion.div
                animate={{ rotate: [6, 10, 6], y: [0, 6, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-2 top-24 rounded-xl border-2 border-[#9b6233] bg-[#fff7d9] px-4 py-3 text-center shadow-[4px_5px_0_#9b6233]"
              >
                <p className="text-[9px] font-black uppercase tracking-wider text-[#b45d2c]">
                  Save the date
                </p>
                <p className="mt-1 font-serif text-lg font-black text-[#355640]">
                  {shortDate}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <ScoutBadgeRow />

      <section className="relative z-10 bg-[#fff9ec] px-5 py-20 sm:px-8 lg:px-12">
        <SectionReveal className="mx-auto max-w-6xl">
          <SectionTitle
            kicker="Theme direction"
            title="Adventure in the background, party in the spotlight"
            description="This version is focused on the party itself. The adventure inspiration appears through warm colors, balloons, scout-style badges, clouds, and little explorer details while keeping the celebration as the main focus."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                label: "Sky and cloud atmosphere",
                icon: <Compass className="size-6" />,
              },
              {
                label: "Balloon and scout-style accents",
                icon: <CalendarDays className="size-6" />,
              },
              {
                label: "Party setup, cake, and celebration details",
                icon: <Gift className="size-6" />,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.6rem] border-2 border-[#dbc08a] bg-[#fffdf8] p-6 text-center shadow-[7px_9px_0_#ad7440]"
              >
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f4d16f] text-[#24523f] shadow-sm">
                  {item.icon}
                </div>
                <p className="mt-5 text-lg font-black text-[#2a4f3c]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      <section
        id="countdown"
        className="relative z-10 scroll-mt-10 overflow-hidden bg-[#f7f1df] px-5 py-20 sm:px-8 lg:px-12"
      >
        <div className="absolute left-[-70px] top-10 size-48 rounded-full border-[22px] border-[#e9cc83]/30" />
        <div className="absolute right-[-80px] bottom-0 size-56 rounded-full border-[24px] border-[#8bb99e]/20" />
        <SectionReveal className="relative mx-auto max-w-5xl">
          <SectionTitle
            kicker="Countdown to the big day"
            title="The celebration begins in"
            description={
              countdown.expired
                ? "The celebration day has arrived!"
                : `Mark your calendar for ${eventDate}.`
            }
          />

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-4 gap-3 sm:gap-5">
            <CountdownUnit value={countdown.days} label="Days" />
            <CountdownUnit value={countdown.hours} label="Hours" />
            <CountdownUnit value={countdown.minutes} label="Minutes" />
            <CountdownUnit value={countdown.seconds} label="Seconds" />
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openGoogleCalendar}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#285b46] px-6 py-3.5 text-sm font-black text-white shadow-[0_8px_0_#173d2e] transition hover:-translate-y-1"
            >
              <CalendarDays className="size-4" />
              Add to Google Calendar
            </button>
            <button
              type="button"
              onClick={downloadCalendarFile}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#a56a38] bg-[#fff8e5] px-6 py-3.5 text-sm font-black text-[#694124] shadow-[0_8px_0_#a56a38] transition hover:-translate-y-1"
            >
              <Download className="size-4" />
              Download calendar
            </button>
          </div>
        </SectionReveal>
      </section>

      <section className="relative z-10 bg-[#e8f5fb] px-5 py-20 sm:px-8 lg:px-12">
        <SectionReveal className="mx-auto max-w-7xl">
          <SectionTitle
            kicker="Party highlights"
            title="What the celebration can look like"
            description="This section highlights the important parts of the celebration—setup, decor, sweets, giveaways, and memorable moments."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {PARTY_GALLERY.map((item) => (
              <GalleryCard
                key={item.title}
                title={item.title}
                description={item.description}
                badge={item.badge}
                icon={item.icon}
              />
            ))}
          </div>
        </SectionReveal>
      </section>

      <section className="relative z-10 bg-[#fff9eb] px-5 py-20 sm:px-8 lg:px-12">
        <SectionReveal className="mx-auto max-w-7xl">
          <SectionTitle
            kicker="Ceremony & celebration"
            title="Our travel stops for the day"
            description="Two special stops await our guests: the christening ceremony and the birthday celebration reception."
          />

          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            <LocationCard
              type="Ceremony"
              title={INVITATION.church.name}
              time={INVITATION.church.time}
              address={INVITATION.church.address}
              icon={<Church className="size-7" />}
              onMap={() =>
                openMap(INVITATION.church.name, INVITATION.church.address)
              }
            />
            <LocationCard
              type="Reception"
              title={INVITATION.reception.name}
              time={INVITATION.reception.time}
              address={INVITATION.reception.address}
              icon={<Gift className="size-7" />}
              onMap={() =>
                openMap(INVITATION.reception.name, INVITATION.reception.address)
              }
            />
          </div>
        </SectionReveal>
      </section>

      <section className="relative z-10 bg-[#f8f0df] px-5 py-20 sm:px-8 lg:px-12">
        <SectionReveal className="mx-auto max-w-7xl">
          <SectionTitle
            kicker="Sponsors & family"
            title="The people we would love to celebrate with"
            description="Honorary guests and loved ones who will be part of this joyful milestone."
          />

          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            <div className="rounded-[2rem] border-2 border-[#d6ba84] bg-[#fff9ee] p-7 shadow-[8px_10px_0_#ad7441]">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#d56032] text-white">
                  <Users className="size-6" />
                </div>
                <h3 className="font-serif text-3xl font-black text-[#27513d]">
                  Ninangs
                </h3>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {GODPARENTS.ninangs.map((name) => (
                  <li
                    key={name}
                    className="rounded-2xl bg-[#fff0cb] px-4 py-3 text-sm font-semibold text-[#645f54] shadow-sm"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border-2 border-[#d6ba84] bg-[#fff9ee] p-7 shadow-[8px_10px_0_#ad7441]">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#27513d] text-white">
                  <Star className="size-6" />
                </div>
                <h3 className="font-serif text-3xl font-black text-[#27513d]">
                  Ninongs
                </h3>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {GODPARENTS.ninongs.map((name) => (
                  <li
                    key={name}
                    className="rounded-2xl bg-[#e7f5eb] px-4 py-3 text-sm font-semibold text-[#645f54] shadow-sm"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionReveal>
      </section>

      <section className="relative z-10 bg-[#fffaf0] px-5 py-20 sm:px-8 lg:px-12">
        <SectionReveal className="mx-auto max-w-7xl">
          <SectionTitle
            kicker="Dress code & gifts"
            title="A little guide for our guests"
            description="To keep the celebration visually coordinated and helpful for everyone, here are our suggested dress and gift notes."
          />

          <div className="mt-12 grid gap-7 lg:grid-cols-2">
            <motion.article
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border-2 border-[#d7bd85] bg-[#fffdf8] p-7 shadow-[10px_12px_0_#ad7543]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#d56331] text-white">
                  <Shirt className="size-6" />
                </div>
                <h3 className="font-serif text-3xl font-black text-[#2a4f3c]">
                  Dress Code
                </h3>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#6c6658]">
                {INVITATION.dressCode}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  ["Sky Blue", "#a6dff4"],
                  ["Cream", "#fff3d5"],
                  ["Mustard", "#e7b84e"],
                  ["Sage", "#b5cba6"],
                  ["Warm Orange", "#df7b4d"],
                ].map(([name, color]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-black/5 bg-white p-3 text-center shadow-sm"
                  >
                    <span
                      className="mx-auto block size-10 rounded-xl border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                    <span className="mt-2 block text-xs font-bold text-[#5f624f]">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.article>

            <motion.article
              whileHover={{ y: -6 }}
              className="rounded-[2rem] border-2 border-[#d7bd85] bg-[#fffdf8] p-7 shadow-[10px_12px_0_#ad7543]"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#245843] text-white">
                  <Gift className="size-6" />
                </div>
                <h3 className="font-serif text-3xl font-black text-[#2a4f3c]">
                  Gift Guide
                </h3>
              </div>
              <p className="mt-5 text-sm leading-7 text-[#6c6658]">
                {INVITATION.giftNote}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Books",
                  "Educational toys",
                  "Baby essentials",
                  "Clothes",
                  "Keepsakes",
                  "Cash gift",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-[#eef8df] px-4 py-3 text-sm font-semibold text-[#476048] shadow-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.article>
          </div>
        </SectionReveal>
      </section>

      <section className="relative z-10 bg-[#f7f0df] px-5 py-20 sm:px-8 lg:px-12">
        <SectionReveal className="mx-auto max-w-4xl">
          <SectionTitle
            kicker="Frequently asked questions"
            title="A few helpful details"
            description="Everything your guests may need to know before the celebration."
          />

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, index) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                open={activeFaq === index}
                onToggle={() =>
                  setActiveFaq((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>
        </SectionReveal>
      </section>

      <section className="relative z-10 overflow-hidden bg-[linear-gradient(180deg,#d9eef8_0%,#fef6e7_100%)] px-5 py-24 sm:px-8 lg:px-12">
        <CloudShape className="left-[8%] top-[8%] scale-90" />
        <CloudShape className="right-[10%] bottom-[8%] scale-75 opacity-80" />
        <BalloonCluster className="right-[4%] top-6 opacity-80" />

        <SectionReveal className="relative mx-auto max-w-5xl text-center">
          <SectionTitle
            kicker="See you there"
            title="Come celebrate with us"
            description="We would love to share this meaningful and joyful milestone with you."
          />

          <PartySparkleLine />

          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-[2.5rem] border-[10px] border-[#fff9e9] shadow-[12px_14px_0_#8c5a32]">
            <img
              src={BABY_IMAGE}
              alt="Child portrait"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.button
              type="button"
              onClick={() => setRsvpOpen(true)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d76031] px-7 py-4 text-sm font-black text-white shadow-[0_9px_0_#8a3f22]"
            >
              <Send className="size-4" />
              RSVP Now
            </motion.button>
            <motion.button
              type="button"
              onClick={() =>
                copyText(window.location.href, "Invitation link copied.")
              }
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#2b5843] bg-[#fff9e7] px-7 py-4 text-sm font-black text-[#2b5843] shadow-[0_9px_0_#a06e42]"
            >
              <Copy className="size-4" />
              Copy Invitation Link
            </motion.button>
          </div>
        </SectionReveal>
      </section>

      <AnimatePresence>
        {rsvpOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#10221a]/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.24 }}
              className="relative w-full max-w-xl rounded-[2rem] border-2 border-[#d7ba83] bg-[#fffaf0] p-6 shadow-[10px_12px_0_#8f5c32] sm:p-8"
            >
              <button
                type="button"
                onClick={closeRsvp}
                className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-[#f3e6c7] text-[#795130] transition hover:bg-[#ead8ad]"
              >
                <X className="size-5" />
              </button>

              {!rsvpSuccess ? (
                <>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#b56733]">
                    RSVP form
                  </p>
                  <h3 className="mt-3 font-serif text-4xl font-black text-[#284d3a]">
                    Join the celebration
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#6c6758]">
                    Kindly confirm your attendance on or before{" "}
                    {INVITATION.rsvpDeadline}.
                  </p>

                  <form onSubmit={submitRsvp} className="mt-8 space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#425243]">
                        Full name
                      </label>
                      <input
                        value={formData.fullName}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            fullName: event.target.value,
                          }))
                        }
                        required
                        placeholder="Enter your full name"
                        className="w-full rounded-2xl border border-[#dbcda9] bg-white px-4 py-3.5 text-sm text-[#2e4638] outline-none ring-0 placeholder:text-[#a19a8a] focus:border-[#d06434] focus:ring-4 focus:ring-[#f6d5b7]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#425243]">
                        Attendance
                      </label>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { label: "Gladly attending", value: "yes" as const },
                          { label: "Unable to attend", value: "no" as const },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setFormData((current) => ({
                                ...current,
                                attendance: option.value,
                              }))
                            }
                            className={cn(
                              "rounded-2xl border px-4 py-3 text-left text-sm font-bold transition",
                              formData.attendance === option.value
                                ? "border-[#d56634] bg-[#fff0dd] text-[#a34d23]"
                                : "border-[#ddd3bb] bg-white text-[#586053] hover:border-[#d3ae63]",
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#425243]">
                        Number of guests
                      </label>
                      <select
                        value={formData.guestCount}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            guestCount: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-[#dbcda9] bg-white px-4 py-3.5 text-sm text-[#2e4638] outline-none focus:border-[#d06434] focus:ring-4 focus:ring-[#f6d5b7]"
                      >
                        {Array.from({ length: 10 }, (_, index) =>
                          String(index + 1),
                        ).map((count) => (
                          <option key={count} value={count}>
                            {count}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[#425243]">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(event) =>
                          setFormData((current) => ({
                            ...current,
                            message: event.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Leave a short note or greeting"
                        className="w-full rounded-2xl border border-[#dbcda9] bg-white px-4 py-3.5 text-sm text-[#2e4638] outline-none ring-0 placeholder:text-[#a19a8a] focus:border-[#d06434] focus:ring-4 focus:ring-[#f6d5b7]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !formData.fullName.trim()}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d66231] px-6 py-4 text-sm font-black text-white shadow-[0_8px_0_#8c4022] transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      {submitting ? "Preparing RSVP..." : "Submit RSVP"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#e8f7de] text-[#2f7b3d]">
                    <Check className="size-10" />
                  </div>
                  <h3 className="mt-6 font-serif text-4xl font-black text-[#28503c]">
                    Thank you!
                  </h3>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6c6758]">
                    Your RSVP has been prepared. If no API endpoint is connected
                    yet, your email app will open so you can send the response
                    manually.
                  </p>
                  <button
                    type="button"
                    onClick={closeRsvp}
                    className="mt-8 inline-flex items-center justify-center rounded-full bg-[#295844] px-6 py-3.5 text-sm font-black text-white shadow-[0_8px_0_#183d2f]"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="fixed bottom-5 left-1/2 z-[130] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-white/20 bg-[#20352b] px-4 py-3 text-sm text-white shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  toast.tone === "success" && "bg-[#2e9b48]",
                  toast.tone === "info" && "bg-[#3179d6]",
                  toast.tone === "error" && "bg-[#d04d39]",
                )}
              >
                {toast.tone === "success" ? (
                  <CheckCircle2 className="size-4.5" />
                ) : toast.tone === "info" ? (
                  <Music2 className="size-4.5" />
                ) : (
                  <HelpCircle className="size-4.5" />
                )}
              </div>
              <p className="leading-6">{toast.message}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <style jsx global>{`
        @keyframes badge-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </main>
  );
}
