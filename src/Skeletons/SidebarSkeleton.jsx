import Skeleton from "@mui/material/Skeleton";

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col items-center mt-5 mx-auto rounded-xl border-2 w-[300px]">
      {/* Avatar Section */}
      <div className="w-full py-5 flex flex-col items-center justify-center">
        <Skeleton variant="circular" width={112} height={112} animation="wave" />
        <div className="flex flex-col items-start mt-3 px-5 w-full">
          <Skeleton variant="text" width={140} height={20} animation="wave" />
          <Skeleton variant="text" width={120} height={16} animation="wave" />
        </div>
      </div>

      {/* Menu Section */}
      <div className="w-full px-4 py-5 flex flex-col gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={40}
            animation="wave"
            style={{ borderRadius: 8 }}
          />
        ))}

        {/* Logout button skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          animation="wave"
          style={{ borderRadius: 8, marginTop: 8 }}
        />
      </div>
    </div>
  );
}
