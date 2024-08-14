import { AppState, useAppDispatch } from '../services/app-store';
import { useTypedSelector } from './useTypedSelector';
import { ServiceProviderDispatched } from '../services/service';

export function useService<S extends ServiceProviderDispatched>(
  serviceProvider: S
): ReturnType<S['service']> {
  const dispatch = useAppDispatch();
  const slice = useTypedSelector((state) =>
    serviceProvider.slice
      ? state[serviceProvider.slice as keyof AppState]
      : state
  );
  return serviceProvider.service(slice, dispatch);
}
