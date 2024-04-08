export const RequestGuards = () => ({
  isMinimumStorageLimitReached: (_context, event) => Boolean(event.data),
});
