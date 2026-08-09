import {
  Card,
  CardContent,
  Typography
} from "@mui/material";

interface ProgressCardProps {
  weight: number;
  date: string;
}

function ProgressCard({
  weight,
  date
}: ProgressCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>

        <Typography>
          Peso: {weight} kg
        </Typography>

        <Typography>
          Fecha: {date}
        </Typography>

      </CardContent>
    </Card>
  );
}

export default ProgressCard;
