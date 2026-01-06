import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import { useEffect, useState } from "react";
import {
  getAllDeals,
  deleteDeal,
  updateDealStage,
  addDealNote,
} from "../../api/dealApi";
import DealForm from "./DealForm";
import DealDetails from "./DealDetails";
import { useAppSelector } from "../../app/hooks";

const STAGES = [
  "Prospect",
  "UnderEvaluation",
  "TermSheetSubmitted",
  "Closed",
  "Lost",
];

export default function DealList() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);

  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [note, setNote] = useState("");

  const role = useAppSelector((state) => state.auth.role);

  /* ================= LOAD DEALS ================= */
  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await getAllDeals();
      setDeals(data);
    } catch (err) {
      console.error("Failed to load deals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  /* ================= COMMON CLOSE ================= */
  const closeAll = () => {
    setOpenForm(false);
    setOpenDetails(false);
    setOpenDelete(false);
    setOpenNotes(false);
    setSelectedDeal(null);
    setNote("");
    loadDeals();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!selectedDeal) return;
    await deleteDeal(selectedDeal.id);
    closeAll();
  };

  /* ================= STAGE UPDATE ================= */
  const handleStageChange = async (dealId: string, stage: string) => {
    await updateDealStage(dealId, stage);
    loadDeals();
  };

  /* ================= ADD NOTE (INSTANT UI) ================= */
  const handleAddNote = async () => {
    if (!note.trim() || !selectedDeal) return;

    const newNote = {
      note,
      timestamp: new Date().toISOString(),
    };

    // instant UI update
    setSelectedDeal({
      ...selectedDeal,
      notes: [...(selectedDeal.notes || []), newNote],
    });

    setNote("");

    // backend save
    await addDealNote(selectedDeal.id, newNote.note);
    loadDeals();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Deal Pipeline
      </Typography>

      {/* CREATE DEAL */}
      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
        onClick={() => {
          setSelectedDeal(null);
          setOpenForm(true);
        }}
      >
        Create Deal
      </Button>

      {loading && <CircularProgress />}

      {/* ================= DEAL TABLE ================= */}
      {!loading && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Client</b></TableCell>
                <TableCell><b>Deal Type</b></TableCell>
                <TableCell><b>Sector</b></TableCell>
                <TableCell><b>Stage</b></TableCell>
                {role === "ADMIN" && (
                  <TableCell><b>Deal Value</b></TableCell>
                )}
                <TableCell align="center"><b>Notes</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id} hover>
                  {/* VIEW */}
                  <TableCell
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => {
                      setSelectedDeal(deal);
                      setOpenDetails(true);
                    }}
                  >
                    {deal.clientName}
                  </TableCell>

                  <TableCell>{deal.dealType}</TableCell>
                  <TableCell>{deal.sector}</TableCell>

                  {/* STAGE */}
                  <TableCell>
                    <Select
                      size="small"
                      value={deal.currentStage}
                      onChange={(e) =>
                        handleStageChange(deal.id, e.target.value)
                      }
                    >
                      {STAGES.map((s) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>

                  {/* DEAL VALUE */}
                  {role === "ADMIN" && (
                    <TableCell>{deal.dealValue ?? "-"}</TableCell>
                  )}

                  {/* NOTES */}
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setOpenNotes(true);
                      }}
                    >
                      <NotesIcon fontSize="small" />
                    </IconButton>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="center">
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setOpenForm(true);
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setOpenDetails(true);
                      }}
                    >
                      View
                    </Button>

                    {role === "ADMIN" && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedDeal(deal);
                          setOpenDelete(true);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ================= EDIT ================= */}
      <Dialog open={openForm} onClose={closeAll} maxWidth="sm" fullWidth>
        <DealForm deal={selectedDeal} onSuccess={closeAll} />
      </Dialog>

      {/* ================= VIEW ================= */}
      <Dialog open={openDetails} onClose={closeAll} maxWidth="md" fullWidth>
        {selectedDeal && <DealDetails dealId={selectedDeal.id} />}
      </Dialog>

      {/* ================= NOTES ================= */}
      <Dialog open={openNotes} onClose={closeAll} maxWidth="sm" fullWidth>
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          {selectedDeal?.notes?.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No notes yet
            </Typography>
          )}

          {selectedDeal?.notes?.map((n: any, i: number) => (
            <Paper key={i} sx={{ p: 1, my: 1 }}>
              <Typography variant="body2">{n.note}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(n.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          ))}

          <TextField
            fullWidth
            multiline
            rows={2}
            margin="dense"
            label="Add Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAll}>Close</Button>
          <Button variant="contained" onClick={handleAddNote}>
            Add Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= DELETE ================= */}
      <Dialog open={openDelete} onClose={closeAll}>
        <DialogTitle>Delete Deal</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this deal?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAll}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}