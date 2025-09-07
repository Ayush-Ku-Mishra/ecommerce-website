import Skeleton from "@mui/material/Skeleton";

export function AddressCardSkeleton() {
  return (
    <div className="w-[80%] border-2 shadow mt-5 rounded-xl bg-white p-5">
      {/* Title */}
      <Skeleton
        variant="text"
        width={120}
        height={28}
        animation="wave"
        sx={{ fontSize: "1.25rem", mb: 2 }}
      />

      {/* Add Address Button */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={48}
        animation="wave"
        sx={{
          borderRadius: "8px",
          mb: 4,
        }}
      />

      {/* Address Card */}
      <div
        style={{
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 2px 12px 0 #eef6fa",
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          {/* Tag */}
          <Skeleton
            variant="rectangular"
            width={60}
            height={22}
            animation="wave"
            sx={{ borderRadius: "10px", mr: 2 }}
          />
          {/* Name */}
          <Skeleton
            variant="text"
            width={150}
            height={24}
            animation="wave"
            sx={{ mr: 2 }}
          />
          {/* Phone */}
          <Skeleton variant="text" width={100} height={20} animation="wave" />
          {/* Default tag */}
          <Skeleton
            variant="rectangular"
            width={70}
            height={22}
            animation="wave"
            sx={{ borderRadius: "10px", ml: 2 }}
          />
        </div>

        {/* Address lines */}
        <Skeleton variant="text" width="95%" height={20} animation="wave" />
        <Skeleton variant="text" width="92%" height={20} animation="wave" />
        <Skeleton variant="text" width={160} height={20} animation="wave" sx={{ mb: 2 }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <Skeleton
            variant="rectangular"
            width={72}
            height={34}
            animation="wave"
            sx={{ borderRadius: 6 }}
          />
          <Skeleton
            variant="rectangular"
            width={72}
            height={34}
            animation="wave"
            sx={{ borderRadius: 6 }}
          />
          <Skeleton
            variant="rectangular"
            width={108}
            height={34}
            animation="wave"
            sx={{ borderRadius: 6 }}
          />
        </div>
      </div>
    </div>
  );
}
