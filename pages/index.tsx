import type { NextPage } from 'next';
import MainLayout from '../layouts/main';
import dynamic from 'next/dynamic';

const MapPageContent = dynamic(() => import('../modules/map'), {
  ssr: false
});

const MapSearchPage: NextPage = () => {
  return (
    <MainLayout protectedRoute={false}>
      <MapPageContent />
    </MainLayout>
  );
};

export default MapSearchPage;

// export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
//
//   async function ApiCallResponse<R>(response: R): Promise<R> {
//     console.log('[API] Get position...');
//     return new Promise((resolve) => setTimeout(() => resolve(response), 50));
//   }
//
//   // console.log(context);
//
//   store.dispatch(UserPositionSlice.actions.set(await ApiCallResponse({
//     latitude: 0,
//     longitude: 0,
//   })));
//
//   // store.dispatch(counterSlice.actions.incrementByAmount((new Date()).getMinutes()))
//   //
//   // // console.log(store.getState());
//   //
//
//   // console.log(21);
//
//   return {
//     props: {},
//   };
// });
