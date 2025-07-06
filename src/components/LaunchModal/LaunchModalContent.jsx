import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusBadge } from "../../utils/helpers";
import { Youtube, Globe } from "lucide-react";

export const LaunchModalContent = ({ launchDetails, loadingDetails }) => {
  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-64">
        <img
          src="/Loader.png"
          alt="Loading..."
          className="h-12 w-12 animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-row gap-4 items-start">
        {/* Modal header with image */}
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center">
          {launchDetails?.links?.patch?.small ? (
            <img
              src={launchDetails.links.patch.small}
              alt={launchDetails.name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="text-gray-400 text-xs">No image</div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{launchDetails?.name}</h2>
            {getStatusBadge(launchDetails)}
          </div>

          {/* Rocket info */}
          <div className="mt-1 text-sm text-gray-600">
            {launchDetails?.rocketDetails?.name || "N/A"}
          </div>

          <div className="mt-2 flex gap-1">
            {launchDetails?.links?.webcast && (
              <a
                href={launchDetails.links.webcast}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-gray-200"
                title="Watch on YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {launchDetails?.links?.wikipedia && (
              <a
                href={launchDetails.links.wikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:bg-gray-200"
                title="Wikipedia article"
              >
                <Globe className="h-4 w-4 " />
              </a>
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 text-sm">
        {launchDetails?.details || "No description available."}{" "}
        {launchDetails?.links?.wikipedia && (
          <a
            href={launchDetails.links.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Wikipedia
          </a>
        )}
      </p>

      <div className="mt-6">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-4 font-medium">Flight Number</td>
              <td className="py-2 px-4">
                {launchDetails?.flight_number || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Mission Name</td>
              <td className="py-2 px-4">{launchDetails?.name || "N/A"}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Rocket Type</td>
              <td className="py-2 px-4">
                {launchDetails?.rocketDetails?.type || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Rocket Name</td>
              <td className="py-2 px-4">
                {launchDetails?.rocketDetails?.name || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Manufacturer</td>
              <td className="py-2 px-4">
                {launchDetails?.rocketDetails?.company || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Nationality</td>
              <td className="py-2 px-4">
                {launchDetails?.rocketDetails?.country || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Launch Date</td>
              <td className="py-2 px-4">
                {launchDetails?.date_utc
                  ? formatDate(launchDetails.date_utc)
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Payload Type</td>
              <td className="py-2 px-4">
                {launchDetails?.payloadDetails?.type || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Orbit</td>
              <td className="py-2 px-4">
                {launchDetails?.payloadDetails?.orbit || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-medium">Launch Site</td>
              <td className="py-2 px-4">
                {launchDetails?.launchpadDetails?.full_name ||
                  launchDetails?.launchpadDetails?.name ||
                  "N/A"}
                {launchDetails?.launchpadDetails?.locality && (
                  <span className="text-gray-500 text-sm block">
                    {launchDetails.launchpadDetails.locality},{" "}
                    {launchDetails.launchpadDetails.region}
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
