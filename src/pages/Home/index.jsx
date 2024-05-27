import { Container } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Home = () => {
  return (
    <Container maxWidth="xl">
      <Toolbar>
        <Typography variant="h4" color="primary">
          Home
        </Typography>
      </Toolbar>
    </Container>
  );
};

export default Home;
