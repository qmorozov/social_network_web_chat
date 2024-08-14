export const LocaleService = new (class LocaleService {
  toTime(date: Date) {
    return date.toLocaleTimeString(undefined, { timeStyle: 'short' });
  }
})();
