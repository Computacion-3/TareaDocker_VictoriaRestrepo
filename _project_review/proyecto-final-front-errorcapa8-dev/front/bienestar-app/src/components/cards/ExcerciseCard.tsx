import {
  Card,
  CardContent,
  Typography
} from "@mui/material";

interface ExerciseCardProps {
  name: string;
  category: string;
}

function ExerciseCard({
  name,
  category
}: ExerciseCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>

        <Typography variant="h6">
          {name}
        </Typography>

        <Typography>
          {category}
        </Typography>

      </CardContent>
    </Card>
  );
}

export default ExerciseCard;
