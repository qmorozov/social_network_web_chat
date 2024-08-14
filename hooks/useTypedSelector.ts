import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { AppState } from '../services/app-store';

export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;
