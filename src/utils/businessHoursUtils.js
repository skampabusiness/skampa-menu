// src/utils/businessHoursUtils.js

export const checkIfOpen = (businessHours, specialDates) => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  
  // First check special dates
  const isSpecialDate = specialDates.some(({ startDate, endDate }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
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
  return new Date(date).toLocaleDateString('en-US', {
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