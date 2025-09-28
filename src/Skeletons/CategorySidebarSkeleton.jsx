import Skeleton from "@mui/material/Skeleton";
import { FaPlus } from "react-icons/fa";

export function CategorySidebarSkeleton({ count = 6 }) {
  return (
    <div className="overflow-y-auto h-[calc(100%-140px)] px-2">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-4 px-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg mx-2"
        >
          {/* Text Skeleton */}
          <Skeleton
            variant="text"
            width={120}
            height={20}
            animation="wave"
            sx={{
              bgcolor: "#C7CCD8",
              "&::after": {
                background:
                  "linear-gradient(90deg, transparent, #DEE2EB, transparent)",
              },
              borderRadius: 4,
            }}
          />

          {/* Plus button skeleton */}
          <div className="w-5 h-5">
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              animation="wave"
              sx={{
                bgcolor: "#C7CCD8",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, #DEE2EB, transparent)",
                },
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
