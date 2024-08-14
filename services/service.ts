import type { AppState, useAppDispatch } from './app-store';

export type ServiceProvider<S, R = any> = (
  state: S extends undefined ? AppState : AppState[keyof AppState],
  dispatch: ReturnType<typeof useAppDispatch>
) => R;

export type ServiceProviderDispatched<
  S = any,
  SP extends ServiceProvider<S> = any
> = {
  slice: S;
  service: SP;
};

export type SliceUse<S> = S extends undefined ? undefined : keyof AppState;

export function makeService<
  A,
  SP extends ServiceProvider<S, ReturnType<SP>>,
  S = SliceUse<A>
>(slice: A, service: SP): ServiceProviderDispatched<S, SP> {
  return { slice: slice as unknown as S, service };
}
