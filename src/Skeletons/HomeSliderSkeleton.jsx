// HomeSliderSkeleton.jsx
import Skeleton from "@mui/material/Skeleton";
import { BsImage } from "react-icons/bs"; // Image icon from react-icons

export function HomeSliderSkeleton() {
  return (
    <div className="w-full py-2 mx-auto bg-[#fff0f5]">
      {/* Slider Skeleton */}
      <div className="w-full">
        <div className="w-full h-[140px] sm:h-[280px] md:h-[360px] relative overflow-hidden">
          {/* Grey skeleton with custom animation */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
            sx={{
              bgcolor: '#5F6677', // Your dark grey
              '&::after': {
                background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)', // Lighter version
              },
              borderRadius: 0
            }}
          />
          
          {/* Centered image icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <BsImage className="text-[#8B92A3] w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Features section skeleton */}
      <div className="flex items-center justify-center gap-10 border mt-2 p-4 bg-white border-red-300 rounded-lg">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center justify-center gap-2">
            <Skeleton
              variant="circular"
              width={20}
              height={20}
              animation="wave"
              sx={{
                bgcolor: '#5F6677',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                }
              }}
              className="sm:w-5 sm:h-5"
            />
            <Skeleton
              variant="text"
              width={80}
              height={16}
              animation="wave"
              sx={{
                bgcolor: '#5F6677',
                '&::after': {
                  background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                }
              }}
              className="sm:w-[100px] sm:h-[20px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}