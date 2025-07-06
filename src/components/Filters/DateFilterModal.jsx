import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
export const DateFilterModal = ({ 
  isOpen, 
  onClose, 
  dateRange, 
  setDateRange, 
  quickFilter, 
  setQuickFilter 
}) => {
  const [startDate, endDate] = dateRange;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl">
        <div className="flex flex-col md:flex-row">
          {/* Quick Select Column */}
          <div className="w-full md:w-1/3 pr-0 md:pr-4 border-b md:border-b-0 md:border-r pb-4 md:pb-0">
            <h3 className="font-semibold mb-4">Quick Select</h3>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {['week', 'month', '3months', '6months', 'year', '2years'].map((filter) => (
                <Button
                  key={filter}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setQuickFilter(filter);
                    setDateRange([null, null]);
                    onClose(false);
                  }}
                >
                  {`Past ${filter.replace('months', ' Months').replace('years', ' Years').replace('week', 'Week').replace('month', 'Month')}`}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Pickers */}
          <div className="w-full md:w-2/3 pl-0 md:pl-4 pt-4 md:pt-0">
            <h3 className="font-semibold mb-4">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setDateRange([date, endDate])}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  inline
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  calendarClassName="border rounded-md shadow"
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setDateRange([startDate, date])}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  inline
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  calendarClassName="border rounded-md shadow"
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange([null, null]);
                  setQuickFilter(null);
                }}
              >
                Clear
              </Button>
              <Button
                onClick={() => {
                  setQuickFilter(null);
                  onClose(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};