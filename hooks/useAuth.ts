import { useTypedSelector } from './useTypedSelector';

export function useAuth() {
  return useTypedSelector((state) => state.user);
}
