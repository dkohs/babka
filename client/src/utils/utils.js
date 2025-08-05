export const subDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };
  
  export const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  export const isWithinLast30Days = (date) => {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30);
    return date >= thirtyDaysAgo && date < today;
  };
  
  export const formatDate = (date, format) => {
    const d = new Date(date);
    const months = ['January', 'February', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    switch (format) {
      case 'M/dd/yyyy':
        return `${d.getMonth() + 1}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
      case 'MM/dd/yyyy':
        return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
      case 'EEEE, MMMM dd, yyyy':
        return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      case 'MMMM yyyy':
        return `${months[d.getMonth()]} ${d.getFullYear()}`;
      default:
        return d.toLocaleDateString();
    }
  };