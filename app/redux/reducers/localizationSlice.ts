import {createSlice, PayloadAction} from '@reduxjs/toolkit';
// import {RootState} from './../../../App';

interface selectedLocalizationType {
  // name: string;
  callingCode: number;
  languageCode: string;
  locale: string;
}
// const selectedCountry = (state: RootState) => state.selectedCountry;
const initialState: selectedLocalizationType = {
  // name: 'Rest of the world',
  callingCode: 0,
  languageCode: 'en',
  locale: 'en',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = createAsyncThunk<
//   number,
//   number,
//   {state: {counter: CounterState}}
// >('counter/fetchCount', async (amount: number, {getState}) => {
//   const {value} = getState().counter;
//   const response = await fetchCount(value, amount);
//   return response.data;
// });

export const localizationSlice = createSlice({
  name: 'localization',
  initialState,
  reducers: {
    // getAllLocalizationData: (state) => {
    //   state = localization;
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   // state.value += 1;
    // },
    onLocalizationSelect: (state, action: PayloadAction<any>) => {
      console.log(state);
      console.log(action.payload);
      // state.name = action.payload.name;
      state.callingCode = action.payload.country.callingCode;
      state.languageCode = action.payload.language.languageCode;
      state.locale = action.payload.language.locale;
    },
    // onLanguageSelect: (
    //   state,
    //   action: PayloadAction<selectedLocalizationType>,
    // ) => {
    //   // console.log(state);
    //   // console.log(action.payload);
    //   // state.name = action.payload.name;
    //   state.languageCode = action.payload.languageCode;
    // },
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(incrementAsync.pending, (state) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(incrementAsync.fulfilled, (state, action) => {
  //       state.status = 'idle';
  //       state.value = action.payload;
  //     });
  // },
});

export const {onLocalizationSelect} = localizationSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export default localizationSlice.reducer;
