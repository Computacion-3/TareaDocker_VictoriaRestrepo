import {
  useState
} from "react";

import ProgressCard
from "../components/cards/ProgressCard";
import type { ProgressSummary } from "../types/fitness";

const initialProgress: ProgressSummary[] = [
  {
    id: 1,
    weight: 70,
    date: "2026-06-01"
  },
  {
    id: 2,
    weight: 68,
    date: "2026-06-15"
  }
];

function ProgressPage() {

  const [progress,
        ] =
         useState<ProgressSummary[]>(initialProgress);

  return (
    <>
      <h1>Progreso</h1>

      {progress.map(item => (
        <ProgressCard
          key={item.id}
          weight={item.weight}
          date={item.date}
        />
      ))}
    </>
  );
}

export default ProgressPage;
