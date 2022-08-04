import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { RootStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, Dimensions } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import LoadingScreenComponent from '../components/LoadingScreenComponent';
import useNetInfoHook from '../customHooks/useNetInfoHook';
import { dataRealmCommon } from '../database/dbquery/dataRealmCommon';
import { ActivitiesEntitySchema } from '../database/schema/ActivitiesSchema';
import { ArticleEntitySchema } from '../database/schema/ArticleSchema';
import { BasicPagesSchema } from '../database/schema/BasicPagesSchema';
import { ChildDevelopmentSchema } from '../database/schema/ChildDevelopmentSchema';
import { DailyHomeMessagesSchema } from '../database/schema/DailyHomeMessagesSchema';
import { FAQsSchema } from '../database/schema/FAQsSchema';
import { HealthCheckUpsSchema } from '../database/schema/HealthCheckUpsSchema';
import { MilestonesSchema } from '../database/schema/MilestonesSchema';
import { PinnedChildDevelopmentSchema } from '../database/schema/PinnedChildDevelopmentSchema';
import { StandardDevHeightForAgeSchema } from '../database/schema/StandardDevHeightForAgeSchema';
import { StandardDevWeightForHeightSchema } from '../database/schema/StandardDevWeightForHeightSchema';
import { SurveysSchema } from '../database/schema/SurveysSchema';
import { TaxonomySchema } from '../database/schema/TaxonomySchema';
import { VaccinationSchema } from '../database/schema/VaccinationSchema';
import { VideoArticleEntitySchema } from '../database/schema/VideoArticleSchema';
import { setDownloadedBufferAgeBracket } from '../redux/reducers/childSlice';
import { fetchAPI } from '../redux/sagaMiddleware/sagaActions';
import { receiveAPIFailure } from '../redux/sagaMiddleware/sagaSlice';
import { apiJsonDataGet, getAge } from '../services/childCRUD';
import { deleteArticleNotPinned } from '../services/commonApiService';
import KeepAwake from '@sayem314/react-native-keep-awake';

type ChildSetupNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;
const window = Dimensions.get('window');
type Props = {
  route: any;
  navigation: ChildSetupNavigationProp;
};


const LoadingScreen = ({ route, navigation }: Props) => {
  const dispatch = useAppDispatch();
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const childList = useAppSelector(
    (state: any) => state.childData.childDataSet.allChild != '' ? JSON.parse(state.childData.childDataSet.allChild) : [],
  );
  const { apiJsonData, prevPage, downloadWeeklyData, downloadMonthlyData, downloadBufferData, ageBrackets, forceupdatetime } = route.params;
  const sponsors = useAppSelector(
    (state: any) => state.selectedCountry.sponsors,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const bufferAgeBracket = useAppSelector((state: any) =>
    state.childData.childDataSet.bufferAgeBracket
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const incrementalSyncDT = useAppSelector((state: any) =>
    (state.utilsData.incrementalSyncDT),
  );
  const allDataDownloadFlag = useAppSelector((state: any) =>
    (state.utilsData.allDataDownloadFlag),
  );
  const netInfoval = useNetInfoHook();
  const [netflag, setnetflag] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      console.log(incrementalSyncDT, "incrementalSyncDT in useeffect laoding---", netflag);
      if (netInfoval.isConnected != null && netflag == false) {
        let enableImageDownload = false;
        if (toggleSwitchVal == false && netInfoval.isConnected == true) {
          enableImageDownload = true
        } else {
          enableImageDownload = false
        }
        console.log("keep awake activated");
        setnetflag(true);
        callSagaApi(enableImageDownload);
      }
      return () => {
        // console.log("loading screen left");
      };
    }, [netInfoval.isConnected])
  );
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => {
      backHandler.remove();
    }
  }, []);
  const getAgeWithAgeBrackets = async (prevPage: any) => {
    let alldataarr: any[] = [], deltadataarr: any[] = [];
    if (allDataDownloadFlag == true && prevPage != "CountryLangChange") {
      bufferAgeBracket.map((x: any) => deltadataarr.push(x));
    }
    else {
      const Ages = await getAge(childList, child_age);
      let ageBrackets: any = [];
      childList.map((child: any) => {
        const childAgedays = (DateTime.now()).diff((DateTime.fromISO(child.birthDate)), 'days').toObject().days;
        if (childAgedays >= child.taxonomyData.days_to - child.taxonomyData.buffers_days) {
          const i = child_age.findIndex((_item: any) => _item.id === child.taxonomyData.id);
          if (i > -1 && i < child_age.length - 1) {
            const nextchildAgeData = child_age[i + 1];
            if (nextchildAgeData.age_bracket.length > 0) {
              nextchildAgeData.age_bracket.map((ages: any) => {
                ageBrackets.push(ages);
              })
            }
          }
        }
      });
      const newAges = [...new Set([...Ages, ...ageBrackets])];
      newAges.map(x => {
        if (bufferAgeBracket.indexOf(x) == -1) {
          alldataarr.push(x);
        } else {
          deltadataarr.push(x);
        }
      })
    }
    return { alldataarr: alldataarr, deltadataarr: deltadataarr };
  }
  const callSagaApi = async (enableImageDownload: any) => {
    const routes = navigation.dangerouslyGetState()?.routes;
    console.log(routes.length, "in callSagaApi navigation history--", navigation.dangerouslyGetState());

    const prevRoute = routes.length > 2 ? routes[routes.length - 2] : null;
    if (prevPage == "ChilSetup" || prevPage == "AddEditChild") {
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfoval.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "Home") {
      //append agebrackets to existing on error obj
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfoval.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "CountryLangChange" || prevPage == "DownloadUpdate" || prevPage == "ForceUpdate" || prevPage == "DownloadAllData") {
      //when downloading all data replace agebrackets
      const Ages = await getAgeWithAgeBrackets(prevPage);
      const newAges = [...new Set([...Ages.alldataarr, ...Ages.deltadataarr])]
      let apiJsonDataarticleall: any[] = [], apiJsonDataarticledelta: any[] = [];
      if (Ages.alldataarr?.length > 0 || Ages.deltadataarr?.length > 0) {
        if (prevPage == "DownloadAllData" && allDataDownloadFlag == true) {
          if (Ages.alldataarr?.length > 0) {
            apiJsonDataarticleall = apiJsonDataGet(String(Ages.alldataarr), "all");
          }
          if (Ages.deltadataarr?.length > 0) {
            apiJsonDataarticledelta = apiJsonDataGet(String(Ages.deltadataarr), "all", true, incrementalSyncDT);
          }
        }
        else if (prevPage == "DownloadAllData" && allDataDownloadFlag == false) {
          apiJsonDataarticleall = apiJsonDataGet("all", "all")
        } else if (prevPage == "CountryLangChange") {
          apiJsonDataarticleall = apiJsonDataGet(String(newAges), "all")
        } else {
          if (Ages.alldataarr?.length > 0) {
            apiJsonDataarticleall = apiJsonDataGet(String(Ages.alldataarr), "all");
          }
          if (Ages.deltadataarr?.length > 0) {
            apiJsonDataarticledelta = apiJsonDataGet(String(Ages.deltadataarr), "all", true, incrementalSyncDT);
          }
        }
      } else {
        apiJsonDataarticleall = apiJsonDataGet("all", "all");
      }

      if (apiJsonDataarticleall.length > 0) {
        apiJsonData.push(apiJsonDataarticleall[0]);
      }
      if (apiJsonDataarticledelta.length > 0) {
        apiJsonData.push(apiJsonDataarticledelta[0]);
      }
      console.log(apiJsonData, "--apiJsonDataarticle---", apiJsonDataarticleall, "---apiJsonDataarticleall---", apiJsonDataarticledelta);
      if (prevRoute && prevRoute.name && prevRoute.name == 'DetailsScreen') {

      } else {
        //check download all flag on second downlaodd all click
        if (prevPage == "CountryLangChange" || (prevPage == "DownloadAllData" && allDataDownloadFlag == false)) {
          const schemaarray = [ArticleEntitySchema, PinnedChildDevelopmentSchema, VideoArticleEntitySchema, DailyHomeMessagesSchema,
            BasicPagesSchema, TaxonomySchema, MilestonesSchema, ChildDevelopmentSchema, VaccinationSchema, HealthCheckUpsSchema,
            SurveysSchema, ActivitiesEntitySchema, StandardDevHeightForAgeSchema, StandardDevWeightForHeightSchema, FAQsSchema]
          const resolvedPromises = schemaarray.map(async schema => {
            await dataRealmCommon.deleteOneByOne(schema);
          })
          const results = await Promise.all(resolvedPromises);
        }
      }
      let payload = { errorArr: [], fromPage: 'OnLoad' }
      dispatch(receiveAPIFailure(payload));
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfoval.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "PeriodicSync") {
      //if flag true for buffer then append those in agebrackets
      let allAgeBrackets: any[] = [], deltaageBracktes: any[] = [];
      if (downloadBufferData == true) {
        if (ageBrackets?.length > 0) {
          ageBrackets.map((ages: any) => {
            if (bufferAgeBracket.indexOf(ages) == -1) {
              allAgeBrackets.push(ages);
            } else {
              deltaageBracktes.push(ages);
            }
          })
        }
      }
      if (downloadWeeklyData == true) {
        const Ages = await getAgeWithAgeBrackets(prevPage);
        //check download all flag
        if (Ages.alldataarr?.length > 0) {
          allAgeBrackets = [...new Set([...allAgeBrackets, ...Ages.alldataarr])]
        }
        if (Ages.deltadataarr?.length > 0) {
          deltaageBracktes = [...new Set([...deltaageBracktes, ...Ages.deltadataarr])]
        }
      }
      if (downloadMonthlyData == true) {
        
      }
      allAgeBrackets = [...new Set(allAgeBrackets)];
      let apiJsonDataarticleall: any[] = [], apiJsonDataarticledelta: any[] = [];
      if (allAgeBrackets.length > 0) {
        apiJsonDataarticleall = apiJsonDataGet(String(allAgeBrackets), "all")
      }
      if (deltaageBracktes.length > 0) {
        apiJsonDataarticledelta = apiJsonDataGet(String(deltaageBracktes), "all", true, incrementalSyncDT)
      }
      if (apiJsonDataarticleall.length > 0) {
        apiJsonData.push(apiJsonDataarticleall[0]);
      }
      if (apiJsonDataarticledelta.length > 0) {
        apiJsonData.push(apiJsonDataarticledelta[0]);
      }
      console.log(apiJsonData, "--apiJsonDataarticle sync---", apiJsonDataarticleall, "---apiJsonDataarticleall---", apiJsonDataarticledelta);
      if (allAgeBrackets.length > 0) {
        const newAges = [...new Set([...allAgeBrackets, ...bufferAgeBracket])]
        dispatch(setDownloadedBufferAgeBracket(newAges))
      }
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfoval.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else if (prevPage == "ImportScreen") {
      //when importing data replace agebrackets
      const Ages = await getAge(childList, child_age);
      let apiJsonDataarticle;
      if (Ages?.length > 0) {
        apiJsonDataarticle = apiJsonDataGet(String(Ages), "all")
      }
      else {
        apiJsonDataarticle = apiJsonDataGet("all", "all")
      }
      //Article delete fun if not pinned have to create with ArticleEntitySchema after cvariable success dispatch
      const deleteArticles = await deleteArticleNotPinned();
      dispatch(setDownloadedBufferAgeBracket([]))
      dispatch(fetchAPI(apiJsonDataarticle, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonDataarticle, netInfoval.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
    else {
      dispatch(fetchAPI(apiJsonData, prevPage, dispatch, navigation, languageCode, activeChild, apiJsonData, netInfoval.isConnected, forceupdatetime, downloadWeeklyData, downloadMonthlyData, enableImageDownload))
    }
  }

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.SECONDARY_COLOR;
  return (
    <>
      <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <KeepAwake />
      <LoadingScreenComponent sponsors={sponsors} prevPage={prevPage}></LoadingScreenComponent>
    </>

  );
};

export default LoadingScreen;
