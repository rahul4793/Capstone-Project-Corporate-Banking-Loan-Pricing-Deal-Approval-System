import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Switch,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAllUsers,
  createUser,
  updateUserStatus,
} from "../../api/adminApi";

type User = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  active: boolean;
};

type CreateUserForm = {
  username: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserForm>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ OPEN dialog with clean form
  const handleOpen = () => {
    reset();
    setOpen(true);
  };

  // ✅ CLOSE dialog with clean form
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onCreateUser = async (data: CreateUserForm) => {
    try {
      await createUser(data);
      handleClose(); // closes + resets
      loadUsers();
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  const handleStatusChange = async (id: string, active: boolean) => {
    try {
      await updateUserStatus(id, active);
      loadUsers();
    } catch (err) {
      console.error("Failed to update user status", err);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin – User Management
      </Typography>

      <Button
        variant="contained"
        sx={{ marginBottom: 2 }}
        onClick={handleOpen}
      >
        Create User
      </Button>

      {loading && <CircularProgress />}

      {!loading && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Switch
                    checked={u.active}
                    onChange={(e) =>
                      handleStatusChange(u.id, e.target.checked)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* CREATE USER DIALOG */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New User</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            margin="dense"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="Email"
            margin="dense"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="dense"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Select
            fullWidth
            sx={{ mt: 2 }}
            {...register("role")}
            defaultValue="USER"
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onCreateUser)}
            disabled={isSubmitting}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
