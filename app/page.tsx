import LandingClient from "./pages/landing/landingClient";


export const metadata = {
  title: "Harmony — A monochrome task surface",
  description:
    "Harmony is a learning project: a collaborative task manager built with Next.js, TanStack Query and Tailwind. Hairline borders, dot grids, red signal accents.",
  openGraph: {
    title: "Halftone — Less interface. More signal.",
    description:
      "Monochrome task management. A learning project on the modern React stack.",
  },
};

export default function Page() {
  return <LandingClient />;
}