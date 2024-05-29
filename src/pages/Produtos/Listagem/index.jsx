/* eslint-disable camelcase */
import { Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DataTable from "src/components/DataTable";
import { ModalError, useModal } from "src/components/Modals";
import { api, routes } from "src/services/api";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  
  const { createModal } = useModal();

  const fetchData = useCallback(async (page, per_page) => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.user}?page=${page}&limit=${per_page}`);

      setProdutos(data.results || []);
      setTotalRows(data.count || 0);
    } catch (e) {
      setProdutos([]);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar os produtos",
          textConfirmButton: "Ok",
        },
      });
    } finally {
      setLoading(false);
    }
  }, [createModal]);

  useEffect(() => {
    fetchData(1, perPage);
  }, [perPage]);

  const columns = [
    { name: "Nome", selector: row => row.nome, sortable: true },
    { name: "Quantidade", selector: row => row.quantidade, sortable: true },
  ];

  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async (
    newPerPage,
  ) => {
    setPerPage(newPerPage);
  };

  return (
    <div>
      <Grid>
        <DataTable
          title="Produtos"
          progressPending={loading}
          data={produtos}
          columns={columns}
          routes={{
            deleteRoute: routes.user,
            addRoute: "/painel/produtos/cadastrar",
            editRoute: "/painel/produtos/editar",
          }}
          columnNames={{
            actions: "Ações",
            delete: "Excluir",
            edit: "Editar",
            add: "Adicionar",
          }}
          filters={{
            searchText: true,
          }}
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePerRowsChange}
        />
      </Grid>
    </div>
  );
}

export default ListaProdutos;
