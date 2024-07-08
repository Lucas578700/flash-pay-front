import { useCallback, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CustomCardProduct from "../../components/CardProduct";
import { ModalError, useModal } from "src/components/Modals";
import { api, routes } from "src/services/api";
import {useParams } from "react-router-dom";
import LinearLoader from "src/components/LinearProgres";

const Produtos = () => {
  const [products, setProducts] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(100);
  const [loading, setLoading] = useState(false);

  const { createModal } = useModal();
  const { id } = useParams();

  const fetchData = useCallback(
    async (page, per_page) => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `${routes.product}products-shoppe/${id}/?page=${page}&limit=${per_page}`
        );

        console.log(data);

        setProducts(data.results || []);
        setTotalRows(data.count || 0);
      } catch (e) {
        setProducts([]);
        createModal({
          id: "confirm-get-erro-modal",
          Component: ModalError,
          props: {
            id: "confirm-get-erro",
            title: "Erro",
            message: "Ops, aconteceu algum erro ao buscar os produtos da banca",
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
          Produtos
        </Typography>
      </Toolbar>
      <Box sx={{ marginTop: 4 }}>
        {products.map(product => (
          <Grid item key={String(product.id)}>
            <CustomCardProduct product={product} />
          </Grid>
        ))}
      </Box>
    </Container>
  );
};

export default Produtos;
