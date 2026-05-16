import { notFound } from "next/navigation";
import { getProgramById, getSimilarPrograms, PROGRAMS } from "@/lib/programs-data";
import ProgramDetailClient from "./ProgramDetailClient";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ id: p.id }));
}

export default async function ProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const program = getProgramById(id);
  if (!program) notFound();
  const similar = getSimilarPrograms(id, 5);
  return <ProgramDetailClient program={program} similar={similar} />;
}
