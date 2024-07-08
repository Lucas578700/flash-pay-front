import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaidIcon from "@mui/icons-material/Paid";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Card from '@mui/material/Card';

export default function CustomCardProduct({ product }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={`data:image;base64, ${product.image}`}
          alt={product.name}
        />
        <CardContent>
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 'bold',
            }}
            gutterBottom
            variant="h5"
            component="div"
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography
            sx={{ fontWeight: "500", fontSize: 16 }}
            color="text.secondary"
          >
            Preço: R$ {product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
