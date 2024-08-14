import { bindActionCreators } from 'redux';
import { useAppDispatch } from '../services/app-store';
import { Slice } from '@reduxjs/toolkit';

export function useActions<Of extends Slice>(slice: Of) {
  const dispatch = useAppDispatch();
  return bindActionCreators(slice.actions, dispatch) as Of['actions'];
}
