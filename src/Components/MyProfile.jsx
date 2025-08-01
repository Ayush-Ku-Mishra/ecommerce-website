import React, { useState } from "react";
import AccountDetailsSection from "./AccountDetailsSection";
import TextField from "@mui/material/TextField";
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";

const MyProfile = () => {
  // Initial profile state with separate fields
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    gender: "", // "male" or "female"
    email: "",
    phone: "",
  });

  // Whether form is in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Enable editing
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save updated profile
  const handleUpdate = () => {
    // You can integrate dispatch or API call here to save profile
    alert("Profile updated:\n" + JSON.stringify(profile, null, 2));
    setIsEditing(false);
  };

  return (
    <div className="flex gap-10 ml-10 mt-2 max-w-[1190px] mx-auto mb-8">
      <div className="w-[20%]">
        <AccountDetailsSection />
      </div>
      <div className="w-[80%] p-6 bg-white rounded-xl shadow border border-gray-200">
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="flex flex-col gap-6 max-w-lg"
        >
          <div className="flex gap-4">
            <TextField
              label="First Name"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              fullWidth
              required
              disabled={!isEditing}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              fullWidth
              required
              disabled={!isEditing}
            />
          </div>

          <FormControl component="fieldset" disabled={!isEditing}>
            <FormLabel component="legend" className="mb-1 font-medium text-gray-700">
              Your Gender
            </FormLabel>
            <RadioGroup
              row
              required
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>

          <TextField
            label="Email Address"
            name="email"
            value={profile.email}
            onChange={handleChange}
            type="email"
            fullWidth
            required
            disabled={!isEditing}
          />
          <TextField
            label="Mobile Number"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            type="tel"
            fullWidth
            disabled={!isEditing}
          />

          <div className="flex gap-3">
            {!isEditing ? (
              <Button variant="outlined" color="primary" onClick={handleEdit}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type="submit" variant="contained" color="primary">
                  Update Profile
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
