import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusBadge } from "../../utils/helpers";

export const LaunchTable = ({ launches, handleRowClick, loading }) => {
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <img src="/Loader.png" alt="Loading..." className="h-36 w-36 animate-spin" />
    </div>;
  }

  return (
    <Table>
      <TableHeader className="bg-[#F4F5F7]">
        <TableRow>
          <TableHead className="text-center">No.</TableHead>
          <TableHead>Launched (UTC)</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Mission</TableHead>
          <TableHead>Orbit</TableHead>
          <TableHead>Launch Status</TableHead>
          <TableHead>Rocket</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {launches.length > 0 ? (
          launches.map((launch) => (
            <TableRow
              key={launch.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(launch)}
            >
              <TableCell className="font-medium text-center">
                {launch.flight_number}
              </TableCell>
              <TableCell>{formatDate(launch.date_utc)}</TableCell>
              <TableCell>
                {launch?.launchpadDetails?.full_name || launch?.launchpadDetails?.name || "N/A"}
              </TableCell>
              <TableCell>{launch.name}</TableCell>
              <TableCell>
                {launch.payloadDetails?.orbit || "N/A"}
              </TableCell>
              <TableCell>{getStatusBadge(launch)}</TableCell>
              <TableCell>
                {launch?.rocketDetails?.name || "N/A"}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10">
              <div className="flex flex-col items-center justify-center space-y-2">
                <p className="text-gray-500 font-medium">
                  No results found for the specified filter
                </p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};