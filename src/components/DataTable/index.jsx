import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import LinearProgress from "@mui/material/LinearProgress";
import Card from "@mui/material/Card";
import { TextField } from "@mui/material";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import Add from "@mui/icons-material/Add";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { api } from "src/services/api";
import { useModal, ModalError, ModalSuccess } from "src/components/Modals";
import Modal from "src/components/Modals/Modal";
import { Root, HeaderTable, ButtonAddNew } from "./styles";

function LinearIndeterminate() {
  return (
    <Root>
      <LinearProgress />
    </Root>
  );
}

const paginationComponentOptions = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
  selectAllRowsItem: true,
  selectAllRowsItemText: "Todos",
};

function DataTableComponent({
  title,
  columns,
  routes = {
    deleteRoute: "",
    addRoute: "",
    editRoute: "",
  },
  columnNames = {
    actions: "",
    delete: "",
    edit: "",
    add: "",
  },
  progressPending,
  data = [],
  filters = {
    searchText: false,
  },
  ...props
}) {
  const [items, setItems] = useState([]);
  const [itemsSearch, setItemsSearch] = useState([]);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createModal } = useModal();

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (searchText !== "") {
      const filterData = items.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setItemsSearch(filterData || items);
    }
  }, [searchText]);

  const openSearch = useCallback(
    async (value) => {
      if (!loading) {
        setIsSearchExpanded(value);
        setItemsSearch([]);
      }
    },
    [loading]
  );

  const onAddClick = useCallback(() => {
    navigate(routes.addRoute);
  }, [navigate, routes.addRoute]);

  const onEditClick = useCallback(
    (row) => {
      navigate(`${routes.editRoute}/${row.id}`);
    },
    [navigate, routes.editRoute]
  );

  const onDeleteAlert = useCallback(
    (row) => {
      setRowToDelete(row);
      setConfirmDeleteModalOpen(true);
    },
    [setRowToDelete, setConfirmDeleteModalOpen]
  );

  const closeDeleteModal = useCallback(() => {
    setRowToDelete(null);
    setConfirmDeleteModalOpen(false);
  }, [setRowToDelete, setConfirmDeleteModalOpen]);

  const onDeleteConfirm = useCallback(async () => {
    if (rowToDelete) {
      try {
        setLoading(true);
        await api.delete(`${routes.deleteRoute}${rowToDelete.id}/`);
        createModal({
          id: "confirm-delete-success-modal",
          Component: ModalSuccess,
          props: {
            id: "confirm-delete-success",
            title: "Sucesso",
            message: `${rowToDelete.nome} deletado com sucesso`,
            textConfirmButton: "Ok",
          },
        });

        setItems(prevItems => prevItems.filter(p => p.id !== rowToDelete.id));
        closeDeleteModal();
      } catch (e) {
        createModal({
          id: "confirm-delete-error-modal",
          Component: ModalError,
          props: {
            id: "confirm-delete-error",
            title: "Erro",
            message: `Ops, aconteceu algum erro ao deletar o ${rowToDelete.nome}`,
            textConfirmButton: "Ok",
          },
        });
      } finally {
        setLoading(false);
      }
    }
  }, [
    rowToDelete,
    routes.deleteRoute,
    createModal,
    ModalError,
    ModalSuccess,
    closeDeleteModal,
  ]);

  const Header = useCallback(() => {
    return (
      <HeaderTable>
        <div>
          {title}
          {filters.searchText && isSearchExpanded && (
            <TextField
              label="Search ..."
              color="primary"
              variant="outlined"
              size="small"
              style={{ marginLeft: 10 }}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => openSearch(false)}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
          {!isSearchExpanded && (
            <IconButton onClick={() => openSearch(true)}>
              <SearchIcon />
            </IconButton>
          )}
        </div>
        <div>
          {columnNames.add && (
            <ButtonAddNew
              startIcon={<Add />}
              variant="contained"
              onClick={onAddClick}>
              Adicionar
            </ButtonAddNew>
          )}
        </div>
      </HeaderTable>
    );
  }, [openSearch, isSearchExpanded]);

  const customColumns = [
    ...columns,
    {
      name: columnNames.actions,
      cell: row => (
        <div>
          {columnNames.edit && (
            <IconButton color="warning" onClick={() => onEditClick(row)}>
              <EditIcon />
            </IconButton>
          )}
          {columnNames.delete && (
            <IconButton color="error" onClick={() => onDeleteAlert(row)}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card>
      <DataTable
        title={<Header />}
        fixedHeader
        progressPending={progressPending}
        progressComponent={<LinearIndeterminate />}
        data={itemsSearch.length > 0 ? itemsSearch : items}
        pagination
        sortIcon={<ArrowDownward />}
        columns={customColumns}
        paginationComponentOptions={paginationComponentOptions}
        {...props}
      />
      {columnNames.actions && (
        <Modal
          id="confirm-delete-modal"
          open={confirmDeleteModalOpen}
          onClose={closeDeleteModal}
          title="Confirmar Exclusão"
          textConfirmButton="Confirmar"
          onConfirm={onDeleteConfirm}>
          {rowToDelete && (
            <p>
              Tem certeza que deseja excluir o item{" "}
              <strong>{rowToDelete.nome}</strong>?
            </p>
          )}
        </Modal>
      )}
    </Card>
  );
}

export default DataTableComponent;
