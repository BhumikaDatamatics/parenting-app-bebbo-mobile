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
import TabScreenHeader from '@components/TabScreenHeader';
import VideoPlayer from '@components/VideoPlayer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { articlesTintcolor } from '@styles/style';
import { Heading3, Heading4Center, Heading6Bold, ShiftFromTopBottom5 } from '@styles/typography';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../../App';
import useNetInfoHook from '../../../customHooks/useNetInfoHook';
import { setInfoModalOpened } from '../../../redux/reducers/utilsSlice';
import LoadableImage from '../../../services/LoadableImage';
import { randomArrayShuffle } from '../../../services/Utils';
import { synchronizeEvents } from '../../../services/EventSyncService';

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
  flex1View: {
    flex: 1
  },
  pressablePadding: {
    padding: 13
  }
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
  const dispatch = useAppDispatch();
  const flatListRef = useRef<any>(null);
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

  useFocusEffect(() => {
    if (netInfo.isConnected) {
      synchronizeEvents(netInfo.isConnected);
    }
    setModalVisible(articleModalOpened);
  })
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.ARTICLES_COLOR;
  const backgroundColor = themeContext.colors.ARTICLES_TINTCOLOR;
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
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [keyboardStatus, setKeyboardStatus] = useState<any>();
  const videoIsFocused = useIsFocused();
  const goToArticleDetail = (item: any, queryText: string): any => {
    navigation.navigate('DetailsScreen',
      {
        fromScreen: "Articles",
        headerColor: headerColor,
        backgroundColor: backgroundColor,
        detailData: item,
        listCategoryArray: filterArray,
        queryText: queryText
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
  const setFilteredArticleData = (itemId: any): any => {
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

        setfilteredData(combinedartarr);

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

        setLoadingArticle(false);
        toTop();
      }
    } else {
      setLoadingArticle(false);
      setfilteredData([]);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData(): Promise<any> {
        if (route.params?.categoryArray && route.params?.categoryArray.length > 0) {
          setFilterArray(route.params?.categoryArray);
          setFilteredArticleData(route.params?.categoryArray);
        }
        else {
          setFilterArray([]);
          setFilteredArticleData([]);
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
    }, [route.params?.categoryArray, activeChild?.uuid, languageCode])
  );
  useFocusEffect(
    React.useCallback(() => {
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

    setFilterArray(newFilterArray)
  }
  //code for getting article dynamic data ends here.
  const searchList = async (queryText: any): Promise<any> => {
    setLoadingArticle(true);

    let artData: any;
    let newvideoArticleData: any;
    let combinedartarr = [];
    const videoarticleDataAllCategory = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
    let searchTitleData = [];
    let searchBodyData = [];
    let searchVideoTitleData = [];
    let searchVideoBodyData = [];
    if (queryText != "" && queryText != undefined && queryText != null) {
      searchTitleData = articleDataall.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
      searchBodyData = articleDataall.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
      const searchArticleData: any[] = searchTitleData.concat(searchBodyData)
      artData = [...new Set(searchArticleData)];

      searchVideoTitleData = videoarticleDataAllCategory.filter((element: any) => element.title.toLowerCase().includes(queryText.toLowerCase()));
      searchVideoBodyData = videoarticleDataAllCategory.filter((element: any) => element.body.toLowerCase().includes(queryText.toLowerCase()) || element.summary.toLowerCase().includes(queryText.toLowerCase()));
      const searchVideoArticleData: any[] = searchVideoTitleData.concat(searchVideoBodyData)
      newvideoArticleData = [...new Set(searchVideoArticleData)];

      combinedartarr = mergearr(artData, newvideoArticleData, false);
    }
    else {
      artData = articleDataall.filter((x: any) => articleCategoryArray.includes(x.category));
      newvideoArticleData = VideoArticlesDataall.filter((x: any) => x.mandatory == videoArticleMandatory && x.child_age.includes(activeChild.taxonomyData.id) && articleCategoryArray.includes(x.category) && (x.child_gender == activeChild?.gender || x.child_gender == bothChildGender));
      combinedartarr = mergearr(artData, newvideoArticleData, true);
      // mergearr
    }

    articleData = [...combinedartarr];
    setFilteredArticleData(filterArray);

  }
  return (
    <>
      <OverlayLoadingComponent loading={loadingArticle} />
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
              <SearchInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="always"
                onChangeText={(queryText: any): any => {
                  if (queryText.replace(/\s/g, "") == "") {
                    searchQueryText(queryText.replace(/\s/g, ''));
                  } else {
                    searchQueryText(queryText);
                  }
                }}
                value={queryText}
                onSubmitEditing={async (event): Promise<any> => {
                  console.log("event-", event);
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

                  <IconClearPress onPress={(): any => {
                    searchQueryText('');
                  }}>
                    <Icon
                      name="ic_close"
                      size={10}
                      color="#fff"
                    />
                  </IconClearPress>

                </OuterIconRow>
              }
              <OuterIconRow>

                <Pressable style={styles.pressablePadding} onPress={async (e): Promise<any> => {
                  e.preventDefault();
                  await searchList(queryText);
                  Keyboard.dismiss();

                }}>
                  <Icon
                    name="ic_search"
                    size={20}
                    color="#000"

                  />
                </Pressable>

              </OuterIconRow>


            </SearchBox>
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