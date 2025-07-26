import { useState } from "react";

function SizeChartModal({ imageUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      setIsOpen(false);
    }
  };

  return (
    <div>
      {/* 📏 Size Chart Trigger */}
      <div
        className="flex items-center gap-2 cursor-pointer ml-2"
        onClick={() => setIsOpen(true)}
      >
        <p className="text-sm text-[#2874f0] font-medium">Size Chart</p>
        <img
          className="h-[10px]"
          src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzOCIgaGVpZ2h0PSIxMiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMyODc0RjAiIHN0cm9rZS13aWR0aD0iMS4zIj48cGF0aCBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zNy4zNS42NUguNjV2MTAuN2gzNi43Vi42NXoiLz48cGF0aCBmaWxsPSIjODc4Nzg3IiBkPSJNNi42NSA4LjY1aDF2Mi43aC0xem00LTNIMTFsLS4zNS0uMzVWNWwtLjE1LjE1LS4xNS0uMTV2LjNsLS4zNS4zNWguMzV2NS43SDEwbC4zNS4zNXYuM2wuMTUtLjE1LjE1LjE1di0uM2wuMzUtLjM1aC0uMzV2LTUuN3ptNSAzSDE2bC0uMzUtLjM1VjhsLS4xNS4xNS0uMTUtLjE1di4zbC0uMzUuMzVoLjM1djIuN0gxNWwuMzUuMzV2LjNsLjE1LS4xNS4xNS4xNXYtLjNsLjM1LS4zNWgtLjM1di0yLjd6bTQtM2gxdjUuN2gtMXptNCAzaDF2Mi43aC0xem05IDBoMXYyLjdoLTF6bS00LTNoMXY1LjdoLTF6Ii8+PC9nPjwvc3ZnPg=="
          alt=""
        />
      </div>

      {/* 📋 Modal */}
      {isOpen && imageUrl && (
        <div
          id="modal-backdrop"
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="relative">
            {/* ❌ Close Button Positioned Outside Top-Right */}
            <button
              className="absolute -top-6 -right-6 bg-white rounded-full w-10 h-10 text-center text-3xl font-bold text-red-600 hover:text-red-800 shadow-md"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              &times;
            </button>

            {/* 🖼️ Image Container */}
            <div className="bg-white p-4 rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto">
              <img
                src={imageUrl}
                alt="Size Chart"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SizeChartModal;
