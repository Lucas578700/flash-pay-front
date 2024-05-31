/* eslint-disable camelcase */
import { Grid, Switch } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DataTable from "src/components/DataTable";
import { ModalError, useModal } from "src/components/Modals";
import { api, routes } from "src/services/api";

function ListaEstabelecimentos() {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  
  const { createModal } = useModal();

  const fetchData = useCallback(async (page, per_page) => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.estabelecimentos}?page=${page}&limit=${per_page}`);

      setEstabelecimentos(data.results || []);
      setTotalRows(data.count || 0);
    } catch (e) {
      setEstabelecimentos([]);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar estabelecimentos",
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

  // const onChangeStatus = async (id, status) => {
  //   try {
  //     await api.put(`${`${routes.estabelecimentos}${id}/mudar-status/`}`, {
  //       status,
  //     });
  //   } catch (e) {
  //     createModal({
  //       id: "confirm-altera-status-erro-modal",
  //       Component: ModalError,
  //       props: {
  //         id: "confirm-altera-status-erro",
  //         title: "Erro",
  //         message: "Ops, aconteceu algum erro ao alterar status do estabelecimento",
  //         textConfirmButton: "Ok",
  //       },
  //     });
  //   }
  // };

  const columns = [
    { name: "Nome", selector: row => row.name, sortable: true },
    { name: "CNPJ", selector: row => row.cnpj, sortable: true },
    { name: "Imagem", selector: row => row.image, sortable: true },
    {
      name: "Status",
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: row => {
        return (
          <Switch

            defaultChecked={row.status}
            name="status"
            onChange={() => {
              onChangeStatus(row.id, !row.status);
            }}
          />
        );
      },
    },
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
          title="Estabelecimentos"
          progressPending={loading}
          data={estabelecimentos}
          columns={columns}
          routes={{
            deleteRoute: routes.estabelecimentos,
            addRoute: "/painel/estabelecimento/cadastrar",
            editRoute: "/painel/estabelecimento/editar",
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

export default ListaEstabelecimentos;
