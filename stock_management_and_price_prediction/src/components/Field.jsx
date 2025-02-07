import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Typography, Input } from "@material-tailwind/react";

const Field = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  className = "",
  children, // Slot for custom components
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Label */}
      <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
        {label}
      </Typography>

      <div className="flex flex-col gap-1">
        <div className="relative">
          {/* Default Input or Custom Slot */}
          {children ? (
            children
          ) : (
            <Input
              type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className={`!border-t-blue-gray-200 focus:!border-t-gray-900 ${
                error ? "!border-red-500" : ""
              } ${className}`}
            />
          )}

          {/* Error Icon */}
          {error && (
            <ExclamationCircleIcon className="absolute right-3 top-3 h-5 w-5 text-red-500" />
          )}
        </div>

        {/* Error Message */}
        {error && <Typography className="text-red-500 text-sm">{error}</Typography>}
      </div>
    </div>
  );
};

export default Field;
