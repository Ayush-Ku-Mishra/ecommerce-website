// HomeCatSliderSkeleton.jsx
import Skeleton from "@mui/material/Skeleton";
import { BsImage } from "react-icons/bs";

export function HomeCatSliderSkeleton() {
  // Array to match your breakpoints
  const skeletonCount = 7; // Maximum slides shown

  return (
    <div className="border max-w-full overflow-x-hidden">
      <div className="m-4">
        <div className="grid grid-flow-col gap-10">
          {[...Array(skeletonCount)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              {/* Category Image Skeleton */}
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                  sx={{
                    bgcolor: '#5F6677',
                    '&::after': {
                      background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                    },
                    borderRadius: 8
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BsImage className="text-[#8B92A3] w-6 h-6 lg:w-8 lg:h-8 animate-pulse" />
                </div>
              </div>

              {/* Category Name Skeleton */}
              <div className="mt-3 w-full">
                <Skeleton
                  variant="text"
                  width={60}
                  height={20}
                  animation="wave"
                  sx={{
                    bgcolor: '#5F6677',
                    '&::after': {
                      background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                    }
                  }}
                  style={{ margin: '0 auto' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}