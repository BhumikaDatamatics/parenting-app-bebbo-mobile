import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagaMiddleware/saga';
const {createLogger} = require('redux-logger');
const loggerMiddleware = createLogger({
  collapsed: true,
  duration: true,
});
const sagaMiddleware= createSagaMiddleware();
const allMiddlewares:any[] =[];
if (process.env.NODE_ENV !== 'production' ){
  allMiddlewares.push(loggerMiddleware);
}
allMiddlewares.push(sagaMiddleware);

export default function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck:false,
      }).concat(allMiddlewares),
    devTools: process.env.NODE_ENV !== 'production',
    // preloadedState,
    enhancers: [],
  });
  sagaMiddleware.run(rootSaga);
  return store;
}
