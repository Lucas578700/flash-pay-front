import React from "react";
import { useNavigate } from "react-router-dom";

import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import CustomCard from "src/components/Card";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <Toolbar>
        <Typography variant="h4" color="primary">
          Home
        </Typography>
      </Toolbar>

      <Box
        sx={{
          marginTop: 4,
        }}>
        <CustomCard />
      </Box>
    </Container>
  );
};

export default Home;
