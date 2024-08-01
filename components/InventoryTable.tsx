"use client";
import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Button, TextField } from "@mui/material";
import InventoryForm from "./InventoryForm";
import {
  // delItem,
  GetItemInterface,
  getItems,
} from "@/lib/actions/item.actions";
import UpgradeIcon from "@mui/icons-material/Upgrade";

import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";

export interface ItemInterface {
  id: string;
  name: string;
  sku: string;
  quantity: string;
  price: string;
  location: string;
}

function createData(
  id: string,
  name: string,
  sku: string,
  price: string,
  quantity: string,
  location: string
): ItemInterface {
  return {
    id,
    name,
    sku,
    price,
    quantity,
    location,
  };
}

// const rows = [
//   createData("1", "Cupcake", "305", "3.7", "67", ""),
//   // createData(2, 'Donut', 452, 25.0, 51, 4.9),
//   // createData(3, 'Eclair', 262, 16.0, 24, 6.0),
//   // createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
//   // createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
//   // createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
//   // createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
//   // createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
//   // createData(9, 'KitKat', 518, 26.0, 65, 7.0),
//   // createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
//   // createData(11, 'Marshmallow', 318, 0, 81, 2.0),
//   // createData(12, 'Nougat', 360, 19.0, 9, 37.0),
//   // createData(13, 'Oreo', 437, 18.0, 63, 4.0),
// ];

// const rowItems=items.forEach(item=>createData(`
//   ${item.id}`,
//   `${item.name}`,
//   `${item.sku}`,
//   `${item.price}`,
//   `${item.quantity}`,
//   `${item.location}`,

// ))

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis =
    array && array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof ItemInterface;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "ITEM NAME",
  },
  {
    id: "sku",
    numeric: true,
    disablePadding: false,
    label: "SKU",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "PRICE ($)",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "QTY (ct)",
  },
  {
    id: "location",
    numeric: true,
    disablePadding: false,
    label: "LOCATION",
  },
];

interface EnhancedTableProps {
  numSelected: string;
  onRequestSort: (
    e: React.MouseEvent<unknown>,
    property: keyof ItemInterface
  ) => void;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof ItemInterface) => (e: React.MouseEvent<unknown>) => {
      onRequestSort(e, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={
              Number(numSelected) > 0 && Number(numSelected) < rowCount
            }
            checked={rowCount > 0 && Number(numSelected) === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
          style={{textAlign:"center",fontWeight:700}}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  selected: readonly string[];
  fetchData: () => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const { selected } = props;
  const { fetchData } = props;
  console.log(selected);
  const delItem = async (id: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));
    
      for (const docu of querySnapshot.docs) {
        for(const sel of selected){

          if (docu.data().id === sel) {
            const docRef = doc(db, "items", docu.id);
            await deleteDoc(docRef);
          }
        }
      }
    } catch (err) {
      console.error("Error getting items:", err);
      if (err instanceof Error) {
        throw new Error(`Error: ${err.message}`);
      } else {
        throw new Error(`${JSON.stringify(err)}`);
      }
    } finally {
      window.location.reload()
    }
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Pantry Items
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          <Tooltip title="Delete">
            <IconButton
              onClick={async () => {
                console.log(selected);
                for (const item of selected) {
                  console.log("288", item);
                  await delItem(item);
                }
                // Refresh data after deletion
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
export default function InventoryTable({
  items,
  setItems,
}: {
  items: GetItemInterface[];
  setItems: React.Dispatch<React.SetStateAction<ItemInterface[]>>;
}) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof ItemInterface>("sku");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [id, setId] = React.useState<keyof ItemInterface>("id");
  const [name, setName] = React.useState<keyof ItemInterface>("name");
  const [sku, setSku] = React.useState<keyof ItemInterface>("sku");
  const [price, setPrice] = React.useState<keyof ItemInterface>("price");
  const [quantity, setQuantity] =
    React.useState<keyof ItemInterface>("quantity");
  const [location, setLocation] =
    React.useState<keyof ItemInterface>("location");
  const [isAddItem, setIsAddItem] = React.useState(false);
  const [rows, setRows] = React.useState<ItemInterface[]>([]);

  type EditMode = {
    rowId: string;
    field: keyof ItemInterface;
  } | null;
  const [editMode, setEditMode] = React.useState<EditMode>(null);
  const [editValue, setEditValue] = React.useState<string>("");

  const handleCellClick = (
    rowId: string,
    field: keyof ItemInterface,
    value: string
  ) => {
    if (field === "id") return;
    setEditMode({ rowId, field });
    setEditValue(value);
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (e.key === "Enter" && editMode) {
      const { rowId, field } = editMode;

      try {
        const querySnapshot = await getDocs(collection(db, "items"));

        for (const docu of querySnapshot.docs) {
          if (docu.data().id === rowId) {
            const docRef = doc(db, "items", docu.id);
            await updateDoc(docRef, {
              [field]: editValue,
            });
          }
        }

        // Use getItems to fetch the updated data
        const itemList = await getItems();
        console.log("Fetched itemList:", itemList);
        setItems(itemList);

        const formattedRows = itemList.map((item: GetItemInterface) =>
          createData(
            item.id,
            item.name,
            item.sku,
            item.price,
            item.quantity,
            item.location
          )
        );
        console.log(formattedRows);
        setRows(formattedRows);
      } catch (error) {
        console.error("Error updating document:", error);
      } finally {
        // Fetch updated data and update state

        setEditMode(null);
        setEditValue("");
        window.location.reload();
      }
    }
  };

  const fetchData = async () => {
    try {
      const formattedRows =
        items &&
        items.map((item) =>
          createData(
            item.id,
            item.name,
            item.sku,
            item.price,
            item.quantity,
            item.location
          )
        );
      console.log(formattedRows);
      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  const handleRequestSort = (
    e: React.MouseEvent<unknown>,
    property: keyof ItemInterface
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && items) {
      const newSelected = items.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (e: React.MouseEvent<unknown>, id: string) => {
    console.log(id);
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (e: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDense(e.target.checked);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(items, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );
  console.log(selected);
  return (
    <Box sx={{ width: "90vw" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          fetchData={fetchData}
        />
        <Button
          variant="contained"
          sx={{backgroundColor:"black"}}
          onClick={() => {
            setIsAddItem(!isAddItem);
          }}
        >
          Add Item
        </Button>
        {isAddItem && (
          <div>
            <InventoryForm fetchData={fetchData} />
          </div>
        )}
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length.toString()}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={items.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(e) => handleClick(e, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>

                    {["id", "name", "sku", "price", "quantity", "location"].map(
                      (field) => (
                        <TableCell
                        style={{textAlign:"center"}}
                          key={field}
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          onClick={() => {
                            console.log(row.id);
                            handleCellClick(
                              row.id,
                              field as keyof ItemInterface,
                              row[field as keyof ItemInterface]
                            );
                          }}
                        >
                          {editMode &&
                          editMode.rowId === row.id &&
                          editMode.field === field ? (
                            <TextField
                              value={editValue}
                              onChange={handleCellChange}
                              onKeyDown={handleEditSubmit}
                              autoFocus
                            />
                          ) : (
                            row[field as keyof ItemInterface]
                          )}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
