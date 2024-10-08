import { useCallback, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CustomCard from "src/components/Card";
import { ModalError, useModal } from "src/components/Modals";
import { api, routes } from "src/services/api";
import LinearLoader from "src/components/LinearProgres";

const Home = () => {
  const [shoppes, setShoppes] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(100);
  const [loading, setLoading] = useState(false);

  const { createModal } = useModal();

  const fetchData = useCallback(
    async (page, per_page) => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `${routes.shoppe}?page=${page}&limit=${per_page}`
        );

        setShoppes(data.results || []);
        setTotalRows(data.count || 0);
      } catch (e) {
        setProdutos([]);
        createModal({
          id: "confirm-get-erro-modal",
          Component: ModalError,
          props: {
            id: "confirm-get-erro",
            title: "Erro",
            message: "Ops, aconteceu algum erro ao buscar as barracas",
            textConfirmButton: "Ok",
          },
        });
      } finally {
        setLoading(false);
      }
    },
    [createModal]
  );

  useEffect(() => {
    fetchData(1, perPage);
  }, [perPage]);

  const handlePageChange = page => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async newPerPage => {
    setPerPage(newPerPage);
  };

  if (loading) {
    return <LinearLoader loading={loading} />;
  }

  return (
    <Container maxWidth="xl">
      <Toolbar>
        <Typography variant="h4" color="primary">
          Home
        </Typography>
      </Toolbar>
      <Box sx={{ marginTop: 4 }}>
        {shoppes.map(shoppe => (
          <Grid item key={String(shoppe.id)}>
            <CustomCard shoppe={shoppe} />
          </Grid>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
