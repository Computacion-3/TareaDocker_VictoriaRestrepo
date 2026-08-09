import { Card, CardContent, Typography } from "@mui/material";

interface RoutineCardProps {
  name: string;
  difficulty: string;
}

function RoutineCard({ name, difficulty }: RoutineCardProps) {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {name}
        </Typography>

        <Typography>
          Dificultad: {difficulty}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default RoutineCard;
