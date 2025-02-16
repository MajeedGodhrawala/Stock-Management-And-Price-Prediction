import { StatisticsCard } from "@/widgets/cards";
import { Typography } from "@material-tailwind/react";

const UserStockCard = ({ stock }) => {
  const priceChange = stock.previousPrice
    ? ((stock.currentPrice - stock.previousPrice) / stock.previousPrice) * 100
    : 0;

  const color = priceChange >= 0 ? "green" : "red";
  const formattedChange = priceChange.toFixed(2) + "%";

  // Format the footer as a valid React node
  const footer = (
    <div>
      <Typography variant="small" className={`font-normal text-${color}-500`}>
        <strong>{formattedChange}</strong> ({priceChange >= 0 ? "+" : "-"} 24h change)
      </Typography>
      <Typography variant="small" className="text-blue-gray-500">
        Quantity: {stock.qty}
      </Typography>
      <Typography variant="small" className="text-blue-gray-500">
        Purchase Date: {new Date(stock.date).toLocaleDateString()}
      </Typography>
      <Typography variant="small" className="text-blue-gray-500">
        Purchase Price: ${stock.purchasePrice.toFixed(2)}
      </Typography>
      <Typography variant="small" className="text-blue-gray-500">
        Profit/Loss: ${stock.profitLoss.toFixed(2)}
      </Typography>
    </div>
  );

  return (
    <StatisticsCard
      color={color}
      title={stock.stock_id.short_name}
      value={`$${stock.currentPrice.toFixed(2)}`}
      icon={
        <img
          src={`http://localhost:5000/uploads/${stock.stock_id.stock_pic}`}
          alt={stock.stock_id.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      }
      footer={footer} // Pass the formatted footer
    />
  );
};

export default UserStockCard;