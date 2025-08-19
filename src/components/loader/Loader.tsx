const Loader = ({ size = "large", tip = "Loading...", loading = true }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
    extraLarge: "w-16 h-16",
  };

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center w-full ">
          <div className="flex flex-col items-center gap-3">
            <div
              className={`animate-spin rounded-full border-4 border-gray-200 border-t-amber-500 ${
                sizeClasses[size as keyof typeof sizeClasses]
              }`}
            />

            {tip && <span className="text-white">{tip}</span>}
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
