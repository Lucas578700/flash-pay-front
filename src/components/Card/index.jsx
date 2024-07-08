import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";

import { Button, CardActionArea, CardActions } from '@mui/material';

export default function CustomCard({shoppe}) {
  const navigate = useNavigate();

  const onProducts = () => {
    navigate(`produtos/${shoppe.id}/`);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={`data:image;base64, ${shoppe.image}`}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          {shoppe.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {shoppe.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={onProducts}>
          Ver mais
        </Button>
      </CardActions>
    </Card>
  );
}
