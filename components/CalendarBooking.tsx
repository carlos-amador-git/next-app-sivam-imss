"use client";

import type { CalendarBookingStepType } from "./calendar-booking-types";

import { Calendar, cn, Skeleton, type DateValue, type SharedSelection } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale"; // Import 'es' locale
import { I18nProvider } from '@react-aria/i18n'; // Import I18nProvider for full localization

import BookingDetails from "./booking-details";
import { DurationEnum, durations, type TimeSlot } from "./calendar";
import CalendarTimeSelect from "./calendar-time-select";
import CalendarBookingForm from "./calendar-booking-form";
import CalendarBookingConfirmation from "./calendar-booking-confirmation";

// Define a map for available locales for date-fns
const locales = {
  // 'en': enUS,
  'es': es,
};

// LoadingSkeleton component to display a skeleton UI while the main component is loading
const LoadingSkeleton = () => (
  <div
    className="flex w-[393px] flex-col items-center gap-5 rounded-large bg-default-50 shadow-small lg:w-fit lg:flex-row lg:items-start lg:px-6"
  >
    {/* Left section of the skeleton */}
    <div className="flex w-full flex-col p-6 lg:w-[220px] lg:px-4 lg:pt-8">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="mt-3 h-2.5 w-[60px] rounded-lg" />
      <Skeleton className="mt-[5.5px] h-4 w-[95px]  rounded-lg" />
      <Skeleton className="mt-4 h-[10.5px] w-full  rounded-lg" />
      <Skeleton className="mt-[4.5px] h-[10.5px] w-[112px]  rounded-lg" />
      <Skeleton className="mt-10 h-2.5 w-[40px]  rounded-lg" />
      <Skeleton className="mt-[18px] h-2.5 w-[70px]  rounded-lg" />
      <Skeleton className="mt-[15px] h-2.5 w-[124px]  rounded-lg" />
      <Skeleton className="mt-[29px] h-8 w-[114px]  rounded-lg" />
    </div>
    {/* Middle section (calendar part) of the skeleton */}
    <div className={"w-full px-6 lg:w-[372px] lg:px-0"}>
      <div className={"flex items-center justify-center py-3"}>
        <Skeleton className={"h-[9px] w-[98px] rounded-full"} />
      </div>
      <div className={"grid grid-cols-4 gap-4"}>
        <Skeleton className={"h-2.5 rounded-full"} />
        <Skeleton className={"h-2.5 rounded-full"} />
        <Skeleton className={"h-2.5 rounded-full"} />
        <Skeleton className={"h-2.5 rounded-full"} />
      </div>
      <div className={"mt-8 grid grid-cols-7 gap-5"}>
        {Array.from({ length: 35 }).map((_, i) => {
          return (
            <Skeleton
              key={i}
              className={cn("size-[29px] rounded-full ", {
                "opacity-0": i === 0 || i === 1 || i === 33 || i === 34, // Hide some cells for visual effect
              })}
            />
          );
        })}
      </div>
    </div>
    {/* Right section (time select part) of the skeleton */}
    <div className={"w-full  gap-2 px-6 pb-6 lg:w-[220px] lg:p-0"}>
      <div className={"flex items-center justify-between py-2"}>
        <Skeleton className={"h-[15px] w-[100px] rounded-full "} />
        <Skeleton className={"h-[27px] w-[67px] rounded-full "} />
      </div>
      <div className={"mt-2 space-y-2"}>
        <Skeleton className={"h-10 w-full rounded-full "} />
        <Skeleton className={"h-10 w-full rounded-full "} />
        <Skeleton className={"h-10 w-full rounded-full "} />
        <Skeleton className={"h-10 w-full rounded-full "} />
      </div>
    </div>
  </div>
);

// Main CalendarBooking component
export default function CalendarBooking(data: any) {
  console.log("CalendarBooking data:", data.res.paciente);
  // State to manage the loading status of the component
  const [isLoading, setIsLoading] = useState(true);
  // State to control the current step of the calendar booking process
  const [calendarBookingStep, setCalendarBookingStep] =
    useState<CalendarBookingStepType>("booking_initial");
  // State for the selected time zone, defaulting to the user's system time zone
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  // State for the selected booking duration, defaulting to 15 minutes
  const [selectedDuration, setSelectedDuration] = useState<DurationEnum>(
    DurationEnum.FifteenMinutes,
  );
  // State for the selected date, defaulting to today's date in the local time zone
  const [selectedDate, setSelectedDate] = React.useState<DateValue>(today(getLocalTimeZone()));
  // State for the selected time slot range (e.g., start and end times)
  const [selectedTimeSlotRange, setSelectedTimeSlotRange] = useState<TimeSlot[]>([]);
  // State for the specific selected time string
  const [selectedTime, setSelectedTime] = useState<string>("");
  // State for the current language locale, defaulting to English
  const [currentLangCode, setCurrentLangCode] = useState<'es' | 'es'>('es');

  function initcap(str: string): string {
    if (!str) {
      return ''; // Manejar cadenas nulas o vacías
    }
    return str.toLowerCase().split(' ').map(word => {
      if (word.length === 0) {
        return '';
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  // Handler for when the time zone selection changes
  const onTimeZoneChange = (keys: SharedSelection) => {
    const newTimeZone = Array.from(keys)[0]; // Get the first selected key

    if (newTimeZone) {
      setSelectedTimeZone(newTimeZone.toString()); // Update the selected time zone
    }
  };

  // Handler for when the duration selection changes
  const onDurationChange = (selectedKey: React.Key) => {
    // Find the index of the selected duration in the durations array
    const durationIndex = durations.findIndex((d) => d.key === selectedKey);

    setSelectedDuration(durations[durationIndex].key); // Update the selected duration
    setSelectedTime(""); // Reset selected time when duration changes
  };

  // Handler for when the date selection changes in the calendar
  const onDateChange = (date: DateValue) => {
    setSelectedDate(date); // Update the selected date
  };

  // Handler for when the time slot selection changes
  const onTimeChange = (time: string, selectedTimeSlotRange?: TimeSlot[]) => {
    if (selectedTimeSlotRange) setSelectedTimeSlotRange(selectedTimeSlotRange); // Update time slot range if provided
    setSelectedTime(time); // Update the selected time string
  };

  // Handler for confirming the booking details, moving to the form step
  const onConfirm = () => {
    setCalendarBookingStep("booking_form");
  };

  // Function to determine if a date is unavailable (e.g., a weekend)
  const isDateUnavailable = (date: DateValue) => {
    // Use the current language code for checking weekends
    return isWeekend(date, currentLangCode === 'es' ? 'en-ES' : 'es-ES');
  };

  // Handler to toggle the language between English and Spanish
  const toggleLanguage = () => {
    setCurrentLangCode((prevCode) => (prevCode === 'es' ? 'es' : 'es'));
  };

  // useEffect hook to simulate a loading period for the component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 500ms
    }, 5);

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Conditional rendering based on the loading state
  if (isLoading) {
    return <LoadingSkeleton />; // Show skeleton while loading
  }

  // Conditional rendering based on the current booking step
  if (calendarBookingStep === "booking_form") {
    return (
      <CalendarBookingForm
        selectedDate={selectedDate}
        selectedTimeSlotRange={selectedTimeSlotRange}
        setCalendarBookingStep={setCalendarBookingStep}
      />
    );
  }

  if (calendarBookingStep === "booking_confirmation") {
    return <CalendarBookingConfirmation />;
  }

  // Default rendering for the "booking_initial" step
  return (
    // Wrap the component's content with I18nProvider to set the locale for HeroUI and React Aria components
    <I18nProvider locale={currentLangCode === null ? 'en-ES' : 'es-ES'}>
      <div className="flex w-[393px] flex-col items-center gap-5 rounded-large bg-default-50 shadow-small lg:w-fit lg:flex-row lg:items-start lg:px-6">
        {/* Language toggle button */}
        {/* <button
          onClick={toggleLanguage}
          className="px-4 py-2 rounded-medium bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors mb-4"
        >
          {currentLangCode === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        </button> */}

        {/* Component for displaying and changing booking details (duration, time zone) */}
        <BookingDetails
          selectedDuration={selectedDuration}
          selectedTimeZone={selectedTimeZone}
          onDurationChange={onDurationChange}
          onTimeZoneChange={onTimeZoneChange}
          pacienteData={data} currentLangCode={"es"}        />
        {/* Calendar component for date selection */}
        <Calendar
          calendarWidth="372px"
          className="shadow-none dark:bg-transparent"
          classNames={{
            headerWrapper: "bg-transparent px-3 pt-1.5 pb-3",
            title: "text-default-700 text-small font-semibold",
            gridHeader: "bg-transparent shadow-none",
            gridHeaderCell: "font-medium text-default-400 text-xs p-0 w-full",
            gridHeaderRow: "px-3 pb-3",
            gridBodyRow: "gap-x-1 px-3 mb-1 first:mt-4 last:mb-0",
            gridWrapper: "pb-3",
            cell: "p-1.5 w-full",
            cellButton:
              "w-full h-9 rounded-medium data-[selected]:shadow-[0_2px_12px_0] data-[selected]:shadow-primary-300 text-small font-medium",
          }}
          isDateUnavailable={isDateUnavailable} // Prop to mark certain dates as unavailable
          value={selectedDate} // Controlled component: current selected date
          weekdayStyle="short"
          showMonthAndYearPickers
          onChange={onDateChange} // Handler for date changes
        // The Calendar component from @heroui/react uses @internationalized/date internally for localization.
        // It typically picks up the locale from a higher-level I18nProvider or the environment.
        // Direct prop for locale might not be available, but its internal components should adapt.
        // For `date-fns` formatting, we explicitly pass the locale.
        />
        {/* Component for selecting time slots */}
        <CalendarTimeSelect
          day={selectedDate.day} // Pass the day of the selected date
          duration={selectedDuration} // Pass the selected duration
          selectedTime={selectedTime} // Pass the currently selected time
          // Format the weekday for display in the time select component using the current locale
          weekday={format(selectedDate.toString(), "EEE", { locale: locales[currentLangCode] })}
          onConfirm={onConfirm} // Handler for confirming time selection
          onTimeChange={onTimeChange} // Handler for time slot changes
        />
      </div>
    </I18nProvider>
  );
}
