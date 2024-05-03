import { Box, Button, Container, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const irHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}>
      <Container maxWidth="md">
        <div style={{ display: "flex" }}>
          <div>
            <Typography variant="h1" color="primary">
              404
            </Typography>
            <Typography variant="h6" color="primary">
              The page you’re looking for doesn’t exist.
            </Typography>
            <Button onClick={irHome} variant="contained">
              Back Home
            </Button>
          </div>
          <div>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              width={500}
              height={250}
            />
          </div>
        </div>
      </Container>
    </Box>
  );
}
