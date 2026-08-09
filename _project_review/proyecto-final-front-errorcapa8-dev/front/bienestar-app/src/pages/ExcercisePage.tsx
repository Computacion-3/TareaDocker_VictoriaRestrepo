import {
  useState
} from "react";

import ExcerciseCard from
"../components/cards/ExcerciseCard";
import type { ExerciseSummary } from "../types/fitness";

const initialExercises: ExerciseSummary[] = [
  {
    id: 1,
    name: "Sentadilla",
    category: "Pierna"
  },
  {
    id: 2,
    name: "Press banca",
    category: "Pecho"
  }
];

function ExercisesPage() {

  const [exercises,
        ] =
         useState<ExerciseSummary[]>(initialExercises);

  return (
    <>
      <h1>Ejercicios</h1>

      {exercises.map(exercise => (
        <ExcerciseCard
          key={exercise.id}
          name={exercise.name}
          category={exercise.category}
        />
      ))}
    </>
  );
}

export default ExercisesPage;
