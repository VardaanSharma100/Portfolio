import { HoverBorderGradient } from "@/components/ui/aceternity/hover-border-gradient";

export default function ResumeButton() {
  return (
    <HoverBorderGradient
      containerClassName="rounded-2xl text-sm"
      as="a"
      href="https://drive.google.com/file/d/1fGFO6r07d7HbDyL9qeHk6aFlu4x51xM0/view?usp=sharing"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open resume"
      title="Open resume"
      className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-[var(--text)] transition-[background-color,color] duration-0 hover:duration-300"
    >
      <span>Download Resume</span>
    </HoverBorderGradient>
  );
}



