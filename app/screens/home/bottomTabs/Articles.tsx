import { articleCategoryArray, bothChildGender, maxArticleSize, videoArticleMandatory } from '@assets/translations/appOfflineData/apiConstants';
import ArticleCategories from '@components/ArticleCategories';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import { ArticleListContainer, ArticleListContent, SearchBox, SearchInput } from '@components/shared/ArticlesStyle';
import { DividerArt } from '@components/shared/Divider';
import FirstTimeModal from '@components/shared/FirstTimeModal';
import { FlexCol } from '@components/shared/FlexBoxStyle';
import Icon, { IconClearPress, OuterIconRow } from '@components/shared/Icon';
import ShareFavButtons from '@components/shared/ShareFavButtons';
import Realm from 'realm';
import TabScreenHeader from '@components/TabScreenHeader';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { articlesTintcolor } from '@styles/style';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import LoadableImage from '../../../services/LoadableImage';
import { randomArrayShuffle } from '../../../services/Utils';
import { logEvent, synchronizeEvents } from '../../../services/EventSyncService';
import { dataRealmCommon } from '../../../database/dbquery/dataRealmCommon';
import { HistoryEntity, SearchHistorySchema } from '../../../database/schema/SearchHistorySchema';
import VectorImage from 'react-native-vector-image';
import { index } from 'realm';
import unorm from 'unorm';
import FlexSearch from 'flexsearch';
import Fuse from 'fuse.js';
import { ARTICLE_SEARCHED } from '@assets/data/firebaseEvents';

type ArticlesNavigationProp = StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: ArticlesNavigationProp;
  route: any;
};
const styles = StyleSheet.create({
  cardImage: {
    alignSelf: 'center',
    flex: 1,
    height: 200,
    width: '100%',

  },
  containerView: {
    backgroundColor: articlesTintcolor,
    flex: 1
  },
  container: {
    flexDirection: 'column'
  },
  divider: {
    height: 1,
    backgroundColor: 'grey',
  },
  flex1View: {
    flex: 1
  },
  historyList: {
    position: 'absolute',
    top: 51,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  historyItem: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 14,
    marginHorizontal: 5
  },
  pressablePadding: {
    paddingLeft: 15,
    paddingVertical: 15
  },

});
export type ArticleCategoriesProps = {
  borderColor?: any;
  filterOnCategory?: any;
  filterArray?: any;
  fromPage?: any;
  onFilterArrayChange?: any;
}
const Articles = ({ route, navigation }: any): any => {
  const [modalVisible, setModalVisible] = useState(false);
  const [queryText, searchQueryText] = useState('');
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [historyVisible, setHistoryVisible] = useState(true);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [fuseData, setFuseData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const flatListRef = useRef<any>(null);
  const [searchResults, setSearchResults] = useState([]);
  const setIsModalOpened = async (varkey: any): Promise<any> => {
    if (modalVisible == true) {
      const obj = { key: varkey, value: false };
      dispatch(setInfoModalOpened(obj));
      setModalVisible(false);
    }
  };
  const articleModalOpened = useAppSelector((state: any) =>
    (state.utilsData.IsArticleModalOpened),
  );
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
  const favoriteadvices = useAppSelector((state: any) =>
    state.childData.childDataSet.favoriteadvices
  );
  const modalScreenKey = 'IsArticleModalOpened';
  const modalScreenText = 'articleModalText';
  const netInfo = useNetInfoHook();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  
  //merge array 
  const mergearr = (articlearrold: any[], videoartarrold: any[], isSuffle: boolean): any => {
    let combinedarr: any[] = [];
    let i = 0;
    let j = 0;
    let articlearr: any[] = [];
    let videoartarr: any[] = [];

    if (isSuffle) {
      articlearr = randomArrayShuffle(articlearrold)
      videoartarr = randomArrayShuffle(videoartarrold)
    } else {
      articlearr = articlearrold
      videoartarr = videoartarrold
    }

    if (articlearr.length == 0) {
      combinedarr = [...videoartarr];
    }
    articlearr.map((x: any, index: number) => {
      if (i < maxArticleSize) {
        combinedarr.push(x);
        i++;
        if (index == articlearr.length - 1) {
          if (j < videoartarr.length) {
            const dd = videoartarr.splice(j);
            dd.map((y: any) => combinedarr.push(y));
          }
        }
      } else {
        i = 1;
        if (videoartarr[j]) { combinedarr.push(videoartarr[j]) }
        combinedarr.push(x);
        j++;
        if (index == articlearr.length - 1) {
          if (j < videoartarr.length) {
            const dd = videoartarr.splice(j);
            dd.map((y: any) => combinedarr.push(y));
          }
        }
      }
    });

    return combinedarr;
  }
  const preprocessArticles =  (articles: any): any=> {
    return articles.map((article: any) => ({
      ...article,
      normalizedTitle: normalizeText(article.title),
      normalizedSummary: normalizeText(article.summary),
      normalizedBody: normalizeText(article.body)
    }));
  };

  const normalizeText = (text: string): any => {
    return unorm.nfd(text.toLowerCase()).replace(/[\u0300-\u036f]/g, "");
  };
  const getSearchedKeywords = async (): Promise<any> => {
    const realm = await dataRealmCommon.openRealm();

    if (realm != null) {
      console.log('Seach History is...', realm?.objects('SerachHistory'))
      const unsynchronizedEvents: any = realm.objects('SerachHistory').sorted('createdAt', true).slice(0, 5).map(entry => entry.keyword);
      console.log('Seach History is', unsynchronizedEvents)
      setSearchHistory(unsynchronizedEvents);

    }
    console.log('search history.......', searchHistory)
    //const realm = await dataRealmCommon.openRealm(); 
    //const history:any = realm?.objects('SerachHistory');

  }
  // useEffect(() => {
  //   // Load initial search history from RealmDB

  // }, []);
  const storeUnsyncedEvent = async (realm: any, keyword: any): Promise<any> => {

    realm.write(() => {
      const unsyncedEvent = realm.create('SerachHistory', {
        keyword: keyword,
        createdAt: new Date(),
      }, Realm.UpdateMode.Modified);
      console.log('EventClick unsyncedEvent for category', unsyncedEvent);
    });
  }
  const saveToRealm = async (keyword: string): Promise<any> => {
    // const realm = await dataRealmCommon.openRealm();
    // console.log('Realm Data is',realm?.create())
    // realm?.create('SerachHistory', {
    //   name: keyword,
    //   createdAt: new Date(),
    // });
    const historyData: any = {
      keyword: keyword,
      createdAt: new Date(),
    }
    await dataRealmCommon.create<HistoryEntity>(SearchHistorySchema, historyData);
    // realm?.write(() => {
    //   realm.create('SearchHistory', {
    //     keyword: keyword,
    //     timestamp: new Date(),
    //   });
    // });
  };
  useFocusEffect(
    React.useCallback(() => {
      // whatever
      if (netInfo.isConnected) {
        synchronizeEvents(netInfo.isConnected);
      }
      getSearchedKeywords()
      console.log('UseFouusEffect Articles');
      setModalVisible(articleModalOpened);
    }, [articleModalOpened])//historyVisible
  );
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext?.colors.ARTICLES_TINTCOLOR;
  const { t } = useTranslation();
  //code for getting article dynamic data starts here.
  // let filterArray: string[] = [];
  const fromPage = 'Articles';

  const categoryData = useAppSelector(
    (state: any) => JSON.parse(state.utilsData.taxonomy.allTaxonomyData).category,
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const articleDataall = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const articleDataOld = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));

  const VideoArticlesDataall = useAppSelector(
    (state: any) =>
      state.utilsData.VideoArticlesData != '' ? JSON.parse(state.utilsData.VideoArticlesData) : [],
  );
  const videoarticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));

  let articleData: any = mergearr(articleDataOld, videoarticleData, true);
  const [filteredData, setfilteredData] = useState<any>([]);
  const [filterArray, setFilterArray] = useState([]);

  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const videoIsFocused = useIsFocused();
  const goToArticleDetail = (item: any, queryText: string): any => {
    const keywords = queryText.trim().toLowerCase().split(' ').filter((word: any) => word.trim() !== '');
    navigation.navigate('DetailsScreen',
      {
        fromScreen: "Articles",
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: item,
        listCategoryArray: filterArray,
        queryText: keywords
      });
  };
  const RenderArticleItem = ({ item, index }: any): any => {
    return (
      <ArticleListContainer>
        <Pressable onPress={(): any => { goToArticleDetail(item, queryText) }} key={index}>
          {(netInfo.isConnected == true && item && item.cover_video && item.cover_video.url != "" && item.cover_video.url != undefined) ?
            videoIsFocused == true ? <VideoPlayer selectedPinnedArticleData={item}></VideoPlayer> : null
            : <LoadableImage style={styles.cardImage} item={item} toggleSwitchVal={toggleSwitchVal} resizeMode={FastImage.resizeMode.cover} />
          }
          <ArticleListContent>
            <ShiftFromTopBottom5>
              <Heading6Bold>{categoryData.filter((x: any) => x.id == item.category)[0].name}</Heading6Bold>
            </ShiftFromTopBottom5>
            <Heading3>{item.title}</Heading3>
          </ArticleListContent>
          <ShareFavButtons backgroundColor={'#FFF'} item={item} isFavourite={((favoriteadvices.findIndex((x: any) => x == item?.id)) > -1) ? true : false} isAdvice={true} />
        </Pressable>
      </ArticleListContainer>
    )
  };
  const memoizedValue = useMemo(() => RenderArticleItem, [RenderArticleItem, filteredData]);
  const toTop = (): any => {
    // use current
    flatListRef?.current?.scrollToOffset({ animated: Platform.OS == "android" ? true : false, offset: 0 })
  }
  const setFilteredArticleData = (itemId: any, queryText: any): any => {
    console.log('in set filtered method')
    // Keyboard.dismiss();
    if (articleData != null && articleData != undefined && articleData.length > 0) {
      setLoadingArticle(true);
      
      if (itemId.length > 0) {
        let newArticleData = articleDataOld.filter((x: any) => itemId.includes(x.category));
        let newvideoArticleData = videoarticleData.filter((x: any) => itemId.includes(x.category));
        let titleData = [];
        let bodyData = [];
        let videoTitleData = [];
        let videoBodyData = [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          // filter data with title first then after summary or body
          titleData = newArticleData.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          bodyData = newArticleData.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          // combine array for article
          const combineArticleData: any[] = titleData.concat(bodyData)
          newArticleData = [...new Set(combineArticleData)];

          // filter data with title first then after summary or body
          videoTitleData = newvideoArticleData.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          videoBodyData = newvideoArticleData.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          // combine array for video article
          const combineVideoArticleData: any[] = videoTitleData.concat(videoBodyData)
          newvideoArticleData = [...new Set(combineVideoArticleData)];
        }

        //combine-array
        const combinedartarr = mergearr(newArticleData, newvideoArticleData, false);
        console.log('Search Data', combinedartarr)
        setfilteredData(combinedartarr);
        setHistoryVisible(false);
        setLoadingArticle(false);
        toTop();
      } else {
        let newArticleData = articleData != '' ? articleData : [];
        const videoarticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
        let newvideoArticleData = videoarticleData != '' ? videoarticleData : [];
        let combinedartarr = [];
        let titleData = [];
        let bodyData = [];
        let videoTitleData = [];
        let videoBodyData = [];
        if (queryText != "" && queryText != undefined && queryText != null) {
          titleData = articleDataall.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          bodyData = articleDataall.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          const combineArticleData: any[] = titleData.concat(bodyData)
          newArticleData = [...new Set(combineArticleData)];

          videoTitleData = newvideoArticleData.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
          videoBodyData = newvideoArticleData.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
          const combineVideoArticleData: any[] = videoTitleData.concat(videoBodyData)
          newvideoArticleData = [...new Set(combineVideoArticleData)];

          combinedartarr = mergearr(newArticleData, newvideoArticleData, false);
          setfilteredData(combinedartarr);

        } else {
          setfilteredData(newArticleData);
        }
        console.log('Here is for loading', loadingArticle)
        setLoadingArticle(false);
        console.log('Here is for loading...', loadingArticle)
        setHistoryVisible(false);
        toTop();
      }
    } else {
      setLoadingArticle(false);
      setfilteredData([]);
    }
  }


  useFocusEffect(
    React.useCallback(() => {

      if (queryText == '') {

        async function fetchData(): Promise<any> {
          if (route.params?.categoryArray && route.params?.categoryArray.length > 0) {
            setFilterArray(route.params?.categoryArray);
            setFilteredArticleData(route.params?.categoryArray, queryText);
            console.log('UseFouusEffect Articles one');
          }
          else {
            console.log('UseFouusEffect Articles one', queryText);
            setFilterArray([]);
            setFilteredArticleData([], queryText);
          }
        }
        if (route.params?.backClicked != 'yes') {
          fetchData()
        } else {
          setLoadingArticle(false);
          if (route.params?.backClicked == 'yes') {
            navigation.setParams({ backClicked: 'no' })
          }
        }
      }

    }, [route.params?.categoryArray, activeChild?.uuid, languageCode, queryText])
  );
  useFocusEffect(
    React.useCallback(() => {
      console.log('UseFouusEffect Articles two');
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setKeyboardStatus(true);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardStatus(false);
      });
      return (): any => {
        {
          navigation.setParams({ categoryArray: [] })
          showSubscription.remove();
          hideSubscription.remove();
          // route.params?.currentSelectedChildId = 0;
        }
      }
    }, [])
  );


  const onFilterArrayChange = (newFilterArray: any): any => {
    console.log('filterarray data', newFilterArray)
    setFilterArray(newFilterArray)
  }

  //custom sort function 
  const customSortFunction = (a: any, b: any, queryText: any): any => {
    // Check if a and b are valid strings

    if (typeof a !== 'string' || typeof b !== 'string') {
      return 0; // Return 0 if either a or b is not a string
    }

    // Convert a and b to lowercase strings for case-insensitive comparison
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    // Check if aLower and bLower are valid strings after conversion
    if (typeof aLower !== 'string' || typeof bLower !== 'string') {
      return 0; // Return 0 if either aLower or bLower is not a string
    }

    // Find the index of queryText in aLower and bLower
    const indexA = aLower.indexOf(queryText.toLowerCase());
    const indexB = bLower.indexOf(queryText.toLowerCase());

    return indexB - indexA;
  };
  let artData: any;
  let newvideoArticleData: any;
  let combinedartarr = [];
  let fuse:any;
  
  useEffect(()=>{
    console.log('In every fuse call')
    const videoarticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
    combinedartarr = mergearr(articleDataall, videoarticleDataAllCategory, false);
    articleData = [...combinedartarr];
    const processedArticles =  preprocessArticles(articleData);
    fuse = new Fuse(processedArticles, {
      keys: ['normalizedTitle', 'normalizedSummary', 'normalizedBody'],
      threshold: 0.6, // Adjust as needed
      ignoreLocation: true,
      shouldSort: true,
      includeScore: true,
      // sortFn: (a, b) => customSortFunction(a, b, keywords) // No need to pass queryText here
    });
    setFuseData(fuse)
  },[])
  //code for getting article dynamic data ends here.
  const searchList = async (queryText: any): Promise<any> => {  
    setHistoryVisible(false)
    setLoadingArticle(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    Keyboard.dismiss();
    if (queryText != "" && queryText != undefined && queryText != null) {

      console.log('Fuse data',fuse)

      // if (keywords.length > 1) {
      //   //  setLoadingDataArticle(false);
      //   keywords.map(async (keyword: any) => {
      //     console.log('keyword is search here', keyword)
      //     const results = await fuse.search(keyword).map((result) => result.item).flat();
      //     console.log('Results is search here', results)
      //     setfilteredData(results);
      //   })
      //   setHistoryVisible(false);
      //   toTop();
      //   //setLoadingDataArticle(false);

      // } else {
      //   //   setLoadingDataArticle(false);
      //   const results = await keywords.map((keyword: any) => fuse.search(keyword).map((result) => result.item)).flat();
      //   console.log('Results is search here', results)
      //   setfilteredData(results);
      //   setHistoryVisible(false);
      //   toTop();
      //   //setLoadingDataArticle(false);

      // }

      const keywords = queryText.trim().toLowerCase().split(' ').filter((word: any) => word.trim() !== '');
      if (keywords.length > 1) {
        const resultsPromises = keywords.map(async (keyword: any) => {
          const results = await fuseData?.search(keyword).map((result:any) => result.item).flat();
          return results;
        });
        const resultsArrays = await Promise.all(resultsPromises);
        const aggregatedResults = resultsArrays.flat();
        setfilteredData(aggregatedResults);
        setLoadingArticle(false)
      } else {
        const results = await Promise.all(keywords.map((keyword: any) => fuseData?.search(keyword).map((result:any) => result.item).flat()));
        const aggregatedResults = results.flat();
        setfilteredData(aggregatedResults);
        setLoadingArticle(false)
      }
      const eventData = { 'name': ARTICLE_SEARCHED, 'params': { article_searched: queryText } }
      logEvent(eventData, netInfo.isConnected)
      saveToRealm(queryText);
      const realm = await dataRealmCommon.openRealm();
      storeUnsyncedEvent(realm, queryText)

      // Update search history state
      const updatedHistoryWithoutClickedItem = searchHistory.filter(item => item !== queryText);
      const updatedHistory = [queryText, ...updatedHistoryWithoutClickedItem.slice(0, 4)];
      const filterredUpdatedHistory = [...new Set(updatedHistory)];
      setSearchHistory(filterredUpdatedHistory);

      // Delete older entries beyond the latest 5
      const olderEntries = realm?.objects<HistoryEntity>('SerachHistory').sorted('createdAt', true).slice(0, 5).map(entry => entry.keyword);
      if (olderEntries != undefined && olderEntries?.length > 5) {
        realm?.write(() => {
          realm.delete(olderEntries);
        });
      }
     
      
    }
    else {
      artData = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));
      newvideoArticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
      combinedartarr = mergearr(artData, newvideoArticleData, true);
      // mergearr
      articleData = [...combinedartarr];
      setFilteredArticleData(filterArray, queryText);
     // setLoadingDataArticle(false);
    }
    setLoadingArticle(false)
  }
  // useLayoutEffect(()=>{
  //   console.log('In use layourEffect')
  //   setLoadingDataArticle(true)
    
  // },[searchList])
  const renderSearchHistoryItem = ({ item }: { item: string }): any => (
    <Pressable
      onPress={async (): Promise<any> => {
        // setLoadingDataArticle(true);

        Keyboard.dismiss();
        searchQueryText(item);
        await searchList(item);
      }}
    >

      <View style={styles.historyItem}>
        <View>
          <VectorImage source={require('@assets/svg/history.svg')} />
        </View>

        <Text style={styles.historyText}>{item}</Text>
      </View>
    </Pressable>
  );

  return (
    <>
      {loadingArticle && <OverlayLoadingComponent loading={loadingArticle} />}
      <View style={styles.containerView}>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={(Platform.OS === 'android') ? -200 : 0}
          style={styles.flex1View}
        >
          <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
          <TabScreenHeader
            title={t('articleScreenheaderTitle')}
            headerColor={headerColor}
            textColor="#000"
            setProfileLoading={setProfileLoading}
          />
          <FlexCol>
            <SearchBox>
              <OuterIconRow>

                <Pressable style={styles.pressablePadding} onPress={async (e): Promise<any> => {
                  e.preventDefault();
                  await searchList(queryText);

                }}>
                  <Icon
                    name="ic_search"
                    size={20}
                    color="#000"

                  />
                </Pressable>

              </OuterIconRow>
              <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                onFocus={(): any => {
                  setHistoryVisible(true);
                }}
                onChangeText={async (queryText: any): Promise<any> => {
                  console.log('loghererer', queryText)
                  if (queryText.replace(/\s/g, "") == "") {
                    searchQueryText(queryText.replace(/\s/g, ''));
                    setHistoryVisible(true);
                    //  await searchList(queryText)
                  } else {
                    searchQueryText(queryText);
                    setHistoryVisible(true);
                  }
                }}
                value={queryText}

                onSubmitEditing={async (event: any): Promise<any> => {
                  console.log("event-", queryText);
                  // setLoadingDataArticle(true)
                  setHistoryVisible(false)
                  Keyboard.dismiss();
                  await searchList(queryText);
                }}
                multiline={false}
                // placeholder="Search for Keywords"
                placeholder={t('articleScreensearchPlaceHolder')}
                placeholderTextColor={"gray"}
                allowFontScaling={false}
              />

              {
                Platform.OS == 'android' && queryText.replace(/\s/g, "") != "" &&
                <OuterIconRow>

                  <IconClearPress onPress={async (): Promise<any> => {
                    console.log('cleartext')
                    Keyboard.dismiss();
                    searchQueryText('');
                    setHistoryVisible(true);
                    await searchList('');

                  }}>
                    <Icon
                      name="ic_close"
                      size={10}
                      color="#fff"
                    />
                  </IconClearPress>

                </OuterIconRow>
              }




            </SearchBox>
            {searchHistory.length !== 0 && historyVisible &&


              <FlatList
                data={searchHistory}
                renderItem={renderSearchHistoryItem}
                keyboardShouldPersistTaps='handled'
                keyExtractor={(item, index): any => index.toString()}
                style={styles.historyList}
              />

            }
            <DividerArt></DividerArt>
            <ArticleCategories borderColor={headerColor} filterOnCategory={setFilteredArticleData} fromPage={fromPage} filterArray={filterArray} onFilterArrayChange={onFilterArrayChange} />
            <DividerArt></DividerArt>
            {filteredData.length > 0 ?
              <FlatList
                ref={flatListRef}
                data={filteredData}
                onScroll={(e): any => {
                  console.log(e);
                  if (keyboardStatus == true) {
                    Keyboard.dismiss();
                  }
                }}
                nestedScrollEnabled={true}
                // keyboardDismissMode={"on-drag"}
                // keyboardShouldPersistTaps='always'
                removeClippedSubviews={true} // Unmount components when outside of window 
                initialNumToRender={4} // Reduce initial render amount
                maxToRenderPerBatch={4} // Reduce number in each render batch
                updateCellsBatchingPeriod={100} // Increase time between renders
                windowSize={7} // Reduce the window size
                // renderItem={({ item, index }) => <RenderArticleItem item={item} index={index} />}
                renderItem={memoizedValue}
                keyExtractor={(item): any => item.id.toString()}
              />
              : <Heading4Center>{t('noDataTxt')}</Heading4Center>}

          </FlexCol>
          <FirstTimeModal modalVisible={modalVisible} setIsModalOpened={setIsModalOpened} modalScreenKey={modalScreenKey} modalScreenText={modalScreenText}></FirstTimeModal>

          <OverlayLoadingComponent loading={profileLoading} />
        </KeyboardAvoidingView>

      </View>


    </>
  );
};

export default Articles;