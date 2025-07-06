import React, { useState, useEffect, useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import { format, subDays, subMonths, subYears } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DateFilterModal } from "@/components/Filters/DateFilterModal";
import { LaunchTable } from "@/components/LaunchTable/LaunchTable";
import { LaunchModalContent } from "@/components/LaunchModal/LaunchModalContent";
import CommonPagination from "@/components/common/CommonPagination.jsx";

function Home() {
  const [launches, setLaunches] = useState([]);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const launchesPerPage = 12;
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [quickFilter, setQuickFilter] = useState("");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [launchDetails, setLaunchDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.spacexdata.com/v4/launches");
        const launchesData = await response.json();
        const enhancedLaunches = await Promise.all(
          launchesData.map(async (launch) => {
            try {
              const [rocketData, launchpadData, payloadData] =
                await Promise.all([
                  launch.rocket
                    ? fetch(
                        `https://api.spacexdata.com/v4/rockets/${launch.rocket}`
                      ).then((res) => res.json())
                    : null,
                  launch.launchpad
                    ? fetch(
                        `https://api.spacexdata.com/v4/launchpads/${launch.launchpad}`
                      ).then((res) => res.json())
                    : null,
                  launch.payloads?.length
                    ? fetch(
                        `https://api.spacexdata.com/v4/payloads/${launch.payloads[0]}`
                      ).then((res) => res.json())
                    : null,
                ]);

              return {
                ...launch,
                rocketDetails: rocketData,
                launchpadDetails: launchpadData,
                payloadDetails: payloadData,
              };
            } catch (error) {
              console.error(
                `Error fetching details for launch ${launch.id}:`,
                error
              );
              return launch;
            }
          })
        );

        setLaunches(enhancedLaunches);
        setFilteredLaunches(enhancedLaunches);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching launches:", error);
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  const fetchWithCache = useCallback(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }, []);

  const fetchLaunchDetails = useCallback(
    async (launchId) => {
      try {
        setLoadingDetails(true);

        const launchData = await fetchWithCache(
          `https://api.spacexdata.com/v4/launches/${launchId}`
        );
        if (!launchData) return;

        const [rocketData, launchpadData, payloadData] = await Promise.all([
          launchData.rocket
            ? fetchWithCache(
                `https://api.spacexdata.com/v4/rockets/${launchData.rocket}`
              )
            : null,
          launchData.launchpad
            ? fetchWithCache(
                `https://api.spacexdata.com/v4/launchpads/${launchData.launchpad}`
              )
            : null,
          launchData.payloads?.length
            ? fetchWithCache(
                `https://api.spacexdata.com/v4/payloads/${launchData.payloads[0]}`
              )
            : null,
        ]);

        setLaunchDetails({
          ...launchData,
          rocketDetails: rocketData,
          launchpadDetails: launchpadData,
          payloadDetails: payloadData,
        });
      } catch (error) {
        console.error("Error fetching launch details:", error);
      } finally {
        setLoadingDetails(false);
      }
    },
    [fetchWithCache]
  );


  
  const handleRowClick = (launch) => {
    setIsLaunchModalOpen(true);
    fetchLaunchDetails(launch.id);
  };

  // Apply filters
  useEffect(() => {
    if (!launches.length) return;

    let filtered = [...launches];

    if (statusFilter !== "all") {
      filtered = filtered.filter((launch) => {
        if (statusFilter === "upcoming") return launch.upcoming;
        if (statusFilter === "success")
          return !launch.upcoming && launch.success;
        if (statusFilter === "failed")
          return !launch.upcoming && !launch.success;
        return true;
      });
    }

    // Then apply date filter
    if (quickFilter) {
      const now = new Date();
      let startDate;

      switch (quickFilter) {
        case "week":
          startDate = subDays(now, 7);
          break;
        case "month":
          startDate = subMonths(now, 1);
          break;
        case "3months":
          startDate = subMonths(now, 3);
          break;
        case "6months":
          startDate = subMonths(now, 6);
          break;
        case "year":
          startDate = subYears(now, 1);
          break;
        case "2years":
          startDate = subYears(now, 2);
          break;
        default:
          break;
      }

      filtered = filtered.filter((launch) => {
        const launchDate = new Date(launch.date_utc);
        return launchDate >= startDate && launchDate <= now;
      });
    } else if (startDate && endDate) {
      filtered = filtered.filter((launch) => {
        const launchDate = new Date(launch.date_utc);
        return launchDate >= startDate && launchDate <= endDate;
      });
    }

    setFilteredLaunches(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [statusFilter, quickFilter, dateRange, launches]);

  // Get current launches
  const indexOfLastLaunch = currentPage * launchesPerPage;
  const indexOfFirstLaunch = indexOfLastLaunch - launchesPerPage;
  const currentLaunches = filteredLaunches.slice(
    indexOfFirstLaunch,
    indexOfLastLaunch
  );
  const totalPages = Math.ceil(filteredLaunches.length / launchesPerPage);

  // Get quick filter label
  const getQuickFilterLabel = () => {
    switch (quickFilter) {
      case "week":
        return "Past Week";
      case "month":
        return "Past Month";
      case "3months":
        return "Past 3 Months";
      case "6months":
        return "Past 6 Months";
      case "year":
        return "Past Year";
      case "2years":
        return "Past 2 Years";
      default:
        return "Custom Range";
    }
  };

  // Get status filter label
  const getStatusFilterLabel = () => {
    switch (statusFilter) {
      case "all":
        return "All Launches";
      case "upcoming":
        return "Upcoming Launches";
      case "success":
        return "Successful Launches";
      case "failed":
        return "Failed Launches";
      default:
        return "All Launches";
    }
  };

  return (
    <div className="min-h-screen bg-white-50">
      {/* Navbar */}
      <nav className="py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-center">
          <img src="/Logo.png" alt="SpaceX Logo" className="h-10" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 ">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="pl-3"
                  onClick={() => setIsDateModalOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {getQuickFilterLabel()}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="pl-3">
                  <Filter className="h-4 w-4 mr-2" />
                  {getStatusFilterLabel()}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All Launches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("upcoming")}>
                  Upcoming Launches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("success")}>
                  Successful Launches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("failed")}>
                  Failed Launches
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DateFilterModal
            isOpen={isDateModalOpen}
            onClose={setIsDateModalOpen}
            dateRange={dateRange}
            setDateRange={setDateRange}
            quickFilter={quickFilter}
            setQuickFilter={setQuickFilter}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <img
              src="/Loader.png"
              alt="Loading..."
              className="h-36 w-36 animate-spin"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Table with side margins */}
            <LaunchTable
              launches={currentLaunches}
              handleRowClick={handleRowClick}
              loading={loading}
            />
            {/* Pagination */}
            {filteredLaunches.length > 0 && (
              <CommonPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        )}
        <Dialog open={isLaunchModalOpen} onOpenChange={setIsLaunchModalOpen}>
          <DialogContent className="max-w-l p-0 border-0 max-h-[90vh] overflow-y-auto">
            <LaunchModalContent
              launchDetails={launchDetails}
              loadingDetails={loadingDetails}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default Home;
