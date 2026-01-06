import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createDeal,
  updateDeal,
  updateDealValue,
} from "../../api/dealApi";
import { useAppSelector } from "../../app/hooks";

/* ================= BASE SCHEMA ================= */
const baseSchema = {
  clientName: z.string().min(1, "Client name is required"),
  dealType: z.string().min(1, "Deal type is required"),
  sector: z.string().min(1, "Sector is required"),
  summary: z.string().min(5, "Summary must be at least 5 characters"),
};

type Props = {
  deal?: any;
  onSuccess: () => void;
};

export default function DealForm({ deal, onSuccess }: Props) {
  const role = useAppSelector((state) => state.auth.role);

  /* ================= ROLE-AWARE SCHEMA ================= */
  const dealSchema =
    role === "ADMIN"
      ? z.object({
          ...baseSchema,
          dealValue: z.number().nonnegative("Deal value must be positive"),
        })
      : z.object(baseSchema);

  type DealFormData = z.infer<typeof dealSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      clientName: "",
      dealType: "",
      sector: "",
      summary: "",
      ...(role === "ADMIN" && { dealValue: 0 }),
    } as any,
  });

  /* ================= PRELOAD DATA ================= */
  useEffect(() => {
    if (deal) {
      setValue("clientName", deal.clientName);
      setValue("dealType", deal.dealType);
      setValue("sector", deal.sector);
      setValue("summary", deal.summary);

      if (role === "ADMIN") {
        setValue("dealValue" as any, deal.dealValue ?? 0);
      }
    }
  }, [deal, setValue, role]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (data: DealFormData) => {
    try {
      if (deal) {
        // update non-sensitive
        await updateDeal(deal.id, {
          clientName: data.clientName,
          dealType: data.dealType,
          sector: data.sector,
          summary: data.summary,
        });

        // ADMIN only — deal value
        if (role === "ADMIN" && "dealValue" in data) {
          await updateDealValue(deal.id, data.dealValue as number);
        }
      } else {
        // CREATE
        await createDeal({
          clientName: data.clientName,
          dealType: data.dealType,
          sector: data.sector,
          summary: data.summary,
          ...(role === "ADMIN" && {
            dealValue: (data as any).dealValue,
          }),
        });
      }

      onSuccess();
    } catch (err) {
      console.error("Failed to save deal", err);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {deal ? "Edit Deal" : "Create Deal"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="Client Name"
          margin="dense"
          {...register("clientName")}
          error={!!errors.clientName}
          helperText={errors.clientName?.message}
        />

        <TextField
          fullWidth
          select
          label="Deal Type"
          margin="dense"
          {...register("dealType")}
          error={!!errors.dealType}
          helperText={errors.dealType?.message}
        >
          <MenuItem value="M&A">M&A</MenuItem>
          <MenuItem value="Equity">Equity</MenuItem>
          <MenuItem value="Debt">Debt</MenuItem>
          <MenuItem value="IPO">IPO</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Sector"
          margin="dense"
          {...register("sector")}
          error={!!errors.sector}
          helperText={errors.sector?.message}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Summary"
          margin="dense"
          {...register("summary")}
          error={!!errors.summary}
          helperText={errors.summary?.message}
        />

        {/* ADMIN ONLY — DEAL VALUE */}
        {role === "ADMIN" && (
          <TextField
            fullWidth
            type="number"
            label="Deal Value"
            margin="dense"
            {...register("dealValue" as any, { valueAsNumber: true })}
            error={!!(errors as any).dealValue}
            helperText={(errors as any).dealValue?.message}
          />
        )}

        <Button
          variant="contained"
          sx={{ marginTop: 2 }}
          type="submit"
        >
          {deal ? "Update Deal" : "Create Deal"}
        </Button>
      </form>
    </Box>
  );
}
