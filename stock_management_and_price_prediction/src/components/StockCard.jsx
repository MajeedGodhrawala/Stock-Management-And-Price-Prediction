import { StatisticsCard } from "@/widgets/cards";
import {
    Typography,
  } from "@material-tailwind/react";

const StockCard = ({ stock }) => {
  const priceChange = stock.previousPrice
    ? ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 100
    : 0;

  const color = priceChange >= 0 ? "green" : "red";
  const formattedChange = priceChange.toFixed(2) + "%";

  // Format the footer as a valid React node
  const footer = (
    <Typography
      variant="small"
      className={`font-normal text-${color}-500`}
    >
      <strong>{formattedChange}</strong> ({priceChange >= 0 ? "+" : "-"} 24h change)
    </Typography>
  );

  return (
    <StatisticsCard
      color={color}
      title={stock.short_name}
      value={`$${stock.currentPrice.toFixed(2)}`}
      icon={
        <img
          src={`http://localhost:5000/uploads/${stock.stock_pic}`}
          alt={stock.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      }
      footer={footer} // Pass the formatted footer
    />
  );
};

export default StockCard;