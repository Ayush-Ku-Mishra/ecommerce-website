// HeadPhoneSliderSkeleton.jsx
import Skeleton from "@mui/material/Skeleton";
import { BsImage } from "react-icons/bs";

export function HeadPhoneSliderSkeleton() {
  // Number of skeleton cards to show based on breakpoints
  const skeletonCount = 6;

  return (
    <div className="px-3">
      <div className="grid grid-flow-col gap-4">
        {[...Array(skeletonCount)].map((_, index) => (
          <div key={index} className="w-[200px] shadow-md min-w-0 flex-shrink-0">
            {/* Image Skeleton */}
            <div className="w-full h-48 relative rounded-md overflow-hidden">
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                  bgcolor: '#5F6677',
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <BsImage className="text-[#8B92A3] w-12 h-12 animate-pulse" />
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-2 shadow-md">
              {/* Brand */}
              <Skeleton
                variant="text"
                width={100}
                height={18}
                animation="wave"
                sx={{
                  bgcolor: '#5F6677',
                  marginTop: 1,
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                  }
                }}
              />

              {/* Product Name - 2 lines */}
              <Skeleton
                variant="text"
                width="100%"
                height={40}
                animation="wave"
                sx={{
                  bgcolor: '#5F6677',
                  marginTop: 1,
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                  }
                }}
              />

              {/* Price Section */}
              <div className="flex items-center justify-between mt-2">
                <Skeleton
                  variant="text"
                  width={60}
                  height={24}
                  animation="wave"
                  sx={{
                    bgcolor: '#5F6677',
                    '&::after': {
                      background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                    }
                  }}
                />
                <Skeleton
                  variant="text"
                  width={60}
                  height={24}
                  animation="wave"
                  sx={{
                    bgcolor: '#5F6677',
                    '&::after': {
                      background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                    }
                  }}
                />
              </div>

              {/* Discount */}
              <Skeleton
                variant="text"
                width={70}
                height={20}
                animation="wave"
                sx={{
                  bgcolor: '#5F6677',
                  marginTop: 1,
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                  }
                }}
              />

              {/* Add to Cart Button */}
              <Skeleton
                variant="rectangular"
                width="97%"
                height={36}
                animation="wave"
                sx={{
                  bgcolor: '#5F6677',
                  margin: '1.5rem auto 0.5rem auto',
                  borderRadius: 1,
                  '&::after': {
                    background: 'linear-gradient(90deg, transparent, #8B92A3, transparent)',
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}