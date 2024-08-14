import { makeService } from '../../../services/service';
import { BusinessApi } from '../../company/company.api';
import { AppState } from '../../../services/app-store';
import { MapSlice } from '../store/map';

export const MapProvider = makeService(
  undefined,
  (appState: AppState, dispatch) => {
    return {
      async getSearchHistory() {
        try {
          const history = await BusinessApi.GetInputSearchHistory();
          const unique = history.filter(
            (el: { query: string }, idx: number) =>
              history.findIndex(
                (obj: { query: string }) => obj.query === el.query
              ) === idx
          );
          dispatch(MapSlice.actions.setSearchHistory(unique));
        } catch (e) {
          console.log(e);
        }
      }
    };
  }
);
