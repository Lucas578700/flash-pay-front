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
          height="300"
          width={100}
          image={`data:image;base64, ${product.image}`}
          alt={product.name}
        />
        <CardContent
        sx={{
          backgroundColor: '#5125b0',
          color: 'white',
          border: '1px solid #5125b0',
        }}>
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
          <Typography 
          sx={{ color: 'white' }}
          variant="body2" color="text.secondary">
            {product.description.length > 50 
          ? `${product.description.substring(0, 30)}...` 
          : product.description}
          </Typography>
          <Typography
            sx={{ fontWeight: "500", fontSize: 16, color: 'white' }}
            color="text.secondary"
          >
            Preço: R$ {product.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
