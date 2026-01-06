import {
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  Chip,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getDealById } from "../../api/dealApi";
import { useAppSelector } from "../../app/hooks";

type Props = {
  dealId: string;
  notesOnly?: boolean;
};

export default function DealDetails({ dealId, notesOnly = false }: Props) {
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = useAppSelector((state) => state.auth.role);

  const loadDeal = async () => {
    try {
      setLoading(true);
      const data = await getDealById(dealId);
      setDeal(data);
    } catch (err) {
      console.error("Failed to load deal details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealId]);

  if (loading) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!deal) {
    return (
      <Typography color="error">
        Failed to load deal details
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* ================= HEADER ================= */}
      {!notesOnly && (
        <>
          <Typography variant="h5" gutterBottom>
            {deal.clientName}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip label={`Type: ${deal.dealType}`} size="small" />
            <Chip label={`Sector: ${deal.sector}`} size="small" />
            <Chip
              label={`Stage: ${deal.currentStage}`}
              size="small"
              color="primary"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* ================= SUMMARY ================= */}
          <Typography variant="subtitle1" gutterBottom>
            Deal Summary
          </Typography>

          <Paper sx={{ padding: 2, mb: 3 }}>
            <Typography variant="body2">
              {deal.summary || "—"}
            </Typography>
          </Paper>

          {/* ================= DEAL VALUE ================= */}
          {role === "ADMIN" && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Deal Value
              </Typography>

              <Paper sx={{ padding: 2, mb: 3 }}>
                <Typography variant="body2" fontWeight="bold">
                  ₹ {deal.dealValue?.toLocaleString()}
                </Typography>
              </Paper>
            </>
          )}
        </>
      )}

      {/* ================= NOTES ================= */}
      <Typography variant="subtitle1" gutterBottom>
        Notes
      </Typography>

      {deal.notes.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No notes available
        </Typography>
      )}

      <Grid container direction="column" gap={1}>
        {deal.notes.map((n: any, index: number) => (
          <Paper key={index} sx={{ padding: 1.5 }}>
            <Typography variant="body2">
              {n.note}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {new Date(n.timestamp).toLocaleString()}
            </Typography>
          </Paper>
        ))}
      </Grid>
    </Box>
  );
}
