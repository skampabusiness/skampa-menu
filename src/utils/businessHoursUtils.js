// src/utils/businessHoursUtils.js

export const checkIfOpen = (businessHours, specialDates) => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  
  // First check special dates
  const isSpecialDate = specialDates.some(({ startDate, endDate }) => {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const today = new Date(now.toISOString().split('T')[0] + 'T00:00:00');
    return today >= start && today <= end;
  });

  if (isSpecialDate) {
    return false; // Closed for special date
  }

  // Check regular business hours
  const currentHours = businessHours.find(
    schedule => schedule.day === currentDay
  );

  if (!currentHours) {
    return false;
  }

  // Check if the day is marked as CLOSED
  if (currentHours.openTime === 'CLOSED' || currentHours.closeTime === 'CLOSED') {
    return false;
  }

  const currentTime = now.getHours() * 100 + now.getMinutes();
  const [openHour, openMinute] = currentHours.openTime.split(':');
  const [closeHour, closeMinute] = currentHours.closeTime.split(':');
  
  const openTime = parseInt(openHour) * 100 + parseInt(openMinute);
  const closeTime = parseInt(closeHour) * 100 + parseInt(closeMinute);

  return currentTime >= openTime && currentTime <= closeTime;
};

export const formatDateTime = (date) => {
  // Create a new date and ensure it's treated as UTC
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getBusinessHoursDisplay = (businessHours) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = businessHours.find(schedule => schedule.day === today);
  
  if (!todayHours) return 'Hours not available';
  if (todayHours.openTime === 'CLOSED') return 'Closed today';
  
  return `Today: ${todayHours.openTime} - ${todayHours.closeTime}`;
};