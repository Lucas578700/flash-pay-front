/* eslint-disable camelcase */
import { Grid, Switch } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import DataTable from "src/components/DataTable";
import { ModalError, useModal } from "src/components/Modals";
import { api, routes } from "src/services/api";

function ListaEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  
  const { createModal } = useModal();

  const fetchData = useCallback(async (page, per_page) => {
    try {
      setLoading(true);
      const { data } = await api.get(`${routes.equipamentos}?page=${page}&limit=${per_page}`);

      setEquipamentos(data.results || []);
      setTotalRows(data.count || 0);
    } catch (e) {
      setEquipamentos([]);
      createModal({
        id: "confirm-get-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-get-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao buscar equipamentos",
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

  const onChangeStatus = async (id, status) => {
    try {
      await api.put(`${`${routes.equipamentos}${id}/mudar-status/`}`, {
        status,
      });
    } catch (e) {
      createModal({
        id: "confirm-altera-status-erro-modal",
        Component: ModalError,
        props: {
          id: "confirm-altera-status-erro",
          title: "Erro",
          message: "Ops, aconteceu algum erro ao alterar status do equipamento",
          textConfirmButton: "Ok",
        },
      });
    }
  };

  const columns = [
    { name: "Nome", selector: row => row.nome, sortable: true },
    { name: "Quantidade", selector: row => row.quantidade, sortable: true },
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
          title="Equipamentos"
          progressPending={loading}
          data={equipamentos}
          columns={columns}
          routes={{
            deleteRoute: routes.equipamentos,
            addRoute: "/painel/equipamento/cadastrar",
            editRoute: "/painel/equipamento/editar",
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

export default ListaEquipamentos;
