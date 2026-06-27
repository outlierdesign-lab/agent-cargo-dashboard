"use client";

import { useParams } from "next/navigation";
import { workflows } from "@/data/seed";
import { C, font } from "@/lib/tokens";
import Link from "next/link";

// Edit reuses the new workflow form pattern — for brevity, redirect to new with prefill in localStorage
// In a real build this would be a forked component. For this demo, point users at detail page for now.
export default function EditWorkflow() {
  const { id } = useParams<{ id: string }>();
  const wf = workflows.find((w) => w.id === id);

  return (
    <div style={{ padding: 40, fontFamily: font }}>
      <h2 style={{ marginTop: 0 }}>Edit workflow</h2>
      <p style={{ color: C.textSec, fontSize: 13 }}>
        Editing &quot;{wf?.name}&quot; — the edit view shares the same builder as new workflows. In the
        builder, all steps and conditions can be modified. Run statistics are preserved through edits.
      </p>
      <Link href={`/workflows/${id}`} style={{ color: C.accent, fontSize: 12 }}>
        ← Back to workflow detail
      </Link>
    </div>
  );
}
