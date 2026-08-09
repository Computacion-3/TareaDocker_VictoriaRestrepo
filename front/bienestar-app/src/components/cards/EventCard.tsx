import { Card, CardContent, Typography } from "@mui/material";

interface EventCardProps {
  title: string;
  date: string;
}

function EventCard({ title, date }: EventCardProps) {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {title}
        </Typography>

        <Typography>
          Fecha: {date}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default EventCard;
