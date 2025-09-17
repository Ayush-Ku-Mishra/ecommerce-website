import React, { useState, useEffect, useContext } from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import TextField from "@mui/material/TextField";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import  toast  from "react-hot-toast";
import { useForm } from "react-hook-form";

const MyProfile = () => {
  const { user, isAuthenticated, authLoading, setUser } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile`,
        {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        setUser(data.user);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setPasswordLoading(true);

    try {
      const { data: resData } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/set-password`,
        {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (resData.success) {
        toast.success("Password set successfully!");
        reset();
        setShowPasswords({
          newPassword: false,
          confirmPassword: false,
        });
        setPasswordDialogOpen(false);
      } else {
        toast.error(resData.message || "Failed to set password");
      }
    } catch (error) {
      console.error("Password set error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to set password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClosePasswordDialog = () => {
    reset();
    setShowPasswords({
      newPassword: false,
      confirmPassword: false,
    });
    setPasswordDialogOpen(false);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="px-0 md:px-0 md:flex md:gap-6 lg:ml-10 ml-0 lg:mt-2 max-w-[1200px] mx-auto">
      {/* Mobile: AccountDetailsSection at top */}
      <div className="md:hidden mb-4">
        <AccountDetailsSection />
      </div>

      {/* Desktop: Left Sidebar */}
      <div className="hidden md:block sidebar flex-shrink-0 min-w-[20%] w-auto sticky top-28 self-start">
        <AccountDetailsSection />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:mt-5 relative">
        <Card className="shadow-lg relative">
          {/* Local Loader inside Personal Information Card */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <CircularProgress color="primary" />
            </div>
          )}

          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
              <h2 className="font-semibold text-gray-800 text-2xl md:text-base lg:text-3xl">
                Personal Information
              </h2>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setPasswordDialogOpen(true)}
                size="small"
                className="self-start sm:self-center"
              >
                Set Password
              </Button>
            </div>

            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={!isEditing}
                  size="small"
                  variant="outlined"
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  type="tel"
                  fullWidth
                  disabled={!isEditing}
                  size="small"
                  variant="outlined"
                  helperText={
                    !isEditing
                      ? "Click Edit Profile to change phone number"
                      : "Enter your mobile number"
                  }
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  type="email"
                  fullWidth
                  disabled
                  size="small"
                  variant="outlined"
                  helperText="Email cannot be changed"
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              {!isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  size="medium"
                  className="w-full sm:w-auto"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <form onSubmit={handleUpdate} className="contents">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      size="medium"
                      className="w-full sm:w-auto"
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </Button>
                  </form>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    disabled={loading}
                    size="medium"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Set Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={handleClosePasswordDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" className="font-semibold">
            Set Password
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit(handleSetPassword)}>
          <DialogContent>
            <div className="space-y-4 pt-2">
              {/* New Password */}
              <TextField
                label="New Password"
                type={showPasswords.newPassword ? "text" : "password"}
                fullWidth
                size="small"
                disabled={passwordLoading}
                error={!!errors.newPassword}
                helperText={
                  errors.newPassword?.message ||
                  "At least 6 chars, including uppercase, lowercase, number & special char"
                }
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: regex,
                    message:
                      "Must include uppercase, lowercase, number & special character",
                  },
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("newPassword")}
                        edge="end"
                        size="small"
                      >
                        {showPasswords.newPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm New Password */}
              <TextField
                label="Confirm Password"
                type={showPasswords.confirmPassword ? "text" : "password"}
                fullWidth
                size="small"
                disabled={passwordLoading}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        edge="end"
                        size="small"
                      >
                        {showPasswords.confirmPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </DialogContent>

          <DialogActions className="p-6 pt-2">
            <Button
              onClick={handleClosePasswordDialog}
              disabled={passwordLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Setting..." : "Set Password"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default MyProfile;
