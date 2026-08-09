import { useState } from "react";
import RoutineCard from "../components/cards/RoutineCard";
import type { RoutineSummary } from "../types/fitness";

const initialRoutines: RoutineSummary[] = [
  {
    id: 1,
    name: "Pierna",
    difficulty: "Alta"
  },
  {
    id: 2,
    name: "Cardio",
    difficulty: "Media"
  }
];

function RoutinesPage() {

  const [routines] = useState<RoutineSummary[]>(initialRoutines);

  return (
    <>
      <h1>Rutinas</h1>

      {routines.map(routine => (
        <RoutineCard
          key={routine.id}
          name={routine.name}
          difficulty={routine.difficulty}
        />
      ))}
    </>
  );
}

export default RoutinesPage;
