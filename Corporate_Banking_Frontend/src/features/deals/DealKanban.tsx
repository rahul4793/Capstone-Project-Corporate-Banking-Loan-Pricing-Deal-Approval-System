import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Dialog,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAllDeals, updateDealStage } from "../../api/dealApi";
import DealDetails from "./DealDetails";

const STAGES = [
  "Prospect",
  "UnderEvaluation",
  "TermSheetSubmitted",
  "Closed",
  "Lost",
];

const DEAL_TYPES = ["M&A", "Equity", "Debt", "IPO"];

export default function DealKanban() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealTypeFilter, setDealTypeFilter] = useState("ALL");

  // 🔑 view dialog state
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await getAllDeals();
      setDeals(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const filteredDeals =
    dealTypeFilter === "ALL"
      ? deals
      : deals.filter((d) => d.dealType === dealTypeFilter);

  const dealsByStage = (stage: string) =>
    filteredDeals.filter((d) => d.currentStage === stage);

  const handleStageChange = async (
    dealId: string,
    stage: string
  ) => {
    await updateDealStage(dealId, stage);
    loadDeals();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">
          Deal Pipeline 
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="body2">
            Total Deals: <b>{filteredDeals.length}</b>
          </Typography>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={dealTypeFilter}
              onChange={(e) => setDealTypeFilter(e.target.value)}
            >
              <MenuItem value="ALL">All Deal Types</MenuItem>
              {DEAL_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading && <CircularProgress />}

      {!loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 2,
          }}
        >
          {STAGES.map((stage) => {
            const stageDeals = dealsByStage(stage);

            return (
              <Paper key={stage} sx={{ p: 1.5, bgcolor: "#f6f7f9" }}>
                <Typography align="center" fontWeight={600} mb={1}>
                  {stage} ({stageDeals.length})
                </Typography>

                {stageDeals.length === 0 && (
                  <Typography
                    align="center"
                    variant="body2"
                    color="text.secondary"
                  >
                    No deals
                  </Typography>
                )}

                {stageDeals.map((deal) => (
                  <Paper
                    key={deal.id}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      cursor: "pointer",
                      transition: "0.2s",
                      "&:hover": {
                        boxShadow: 2,
                        transform: "translateY(-1px)",
                      },
                    }}
                    onClick={() => {
                      setSelectedDealId(deal.id);
                      setOpenDetails(true);
                    }}
                  >
                    <Typography fontWeight={600}>
                      {deal.clientName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {deal.dealType} • {deal.sector}
                    </Typography>

                    {/* STAGE UPDATE */}
                    <FormControl
                      size="small"
                      fullWidth
                      sx={{ mt: 1 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={deal.currentStage}
                        onChange={(e) =>
                          handleStageChange(
                            deal.id,
                            e.target.value
                          )
                        }
                        sx={{
                          fontSize: "0.8rem",
                          bgcolor: "#fafafa",
                        }}
                      >
                        {STAGES.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Paper>
                ))}
              </Paper>
            );
          })}
        </Box>
      )}

      {/* DEAL DETAILS DIALOG */}
      <Dialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedDealId && (
          <DealDetails dealId={selectedDealId} />
        )}
      </Dialog>
    </Box>
  );
}
