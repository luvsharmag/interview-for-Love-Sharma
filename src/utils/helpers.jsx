import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "d MMMM yyyy 'at' HH:mm");
};

export const getStatusBadge = (launch) => {
  if (launch?.upcoming) {
    return <Badge className="bg-[#FEF3C7] text-[#92400F]">Upcoming</Badge>;
  }
  return launch?.success ? (
    <Badge className="bg-[#DEF7EC] text-[#03543F]">Success</Badge>
  ) : (
    <Badge className="bg-[#FDE2E1] text-[#981B1C]">Failed</Badge>
  );
};