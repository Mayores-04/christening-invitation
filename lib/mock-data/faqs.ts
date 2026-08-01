import { INVITATION } from "./invitation";

export const FAQS = [
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
