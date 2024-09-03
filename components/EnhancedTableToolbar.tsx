import { db } from "@/app/firebase";
import { alpha, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";

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
          for (const sel of selected) {
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
        window.location.reload();
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
            sx={{ flex: "1 1 100%",fontWeight:"bold",color:"#536493" }}
            variant="h5"
            id="tableTitle"
            component="div"
          >
            Inventory Items
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
          <></>
        
        )}
      </Toolbar>
    );
  }

  export default EnhancedTableToolbar