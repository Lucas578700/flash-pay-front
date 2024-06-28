/* eslint-disable camelcase */
import { Grid } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DataTable from "src/components/DataTable";
import { ModalError, useModal } from "src/components/Modals";
import { api, routes } from "src/services/api";

function ListCategory() {
  const [categorias, setCategorias] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const { createModal } = useModal();

  const fetchData = useCallback(
    async (page, per_page) => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `${routes.category}?page=${page}&limit=${per_page}`
        );

        setCategorias(data.results || []);
        setTotalRows(data.count || 0);
      } catch (e) {
        setCategorias([]);
        createModal({
          id: "confirm-get-erro-modal",
          Component: ModalError,
          props: {
            id: "confirm-get-erro",
            title: "Erro",
            message: "Ops, aconteceu algum erro ao buscar as categorias",
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

  const columns = [{ name: "Nome", selector: row => row.name, sortable: true }];

  const handlePageChange = page => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async newPerPage => {
    setPerPage(newPerPage);
  };

  return (
    <div>
      <Grid>
        <DataTable
          title="categorias"
          progressPending={loading}
          data={categorias}
          columns={columns}
          routes={{
            deleteRoute: routes.category,
            addRoute: "/painel/categoria/cadastrar",
            editRoute: "/painel/categoria/editar",
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

export default ListCategory;
