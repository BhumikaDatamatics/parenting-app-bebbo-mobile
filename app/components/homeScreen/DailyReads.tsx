import { articleCategoryArray } from '@assets/translations/appOfflineData/apiConstants';
import { BgSecondaryTint } from '@components/shared/BackgroundColors';
import { MainContainer } from '@components/shared/Container';
import { FDirRow } from '@components/shared/FlexBoxStyle';
import { DailyAction, DailyArtTitle, DailyBox, DailyTag, DailyTagText, OverlayFaded } from '@components/shared/HomeScreenStyle';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import { useFocusEffect } from '@react-navigation/native';
import { Heading2, Heading3w, Heading4, ShiftFromTopBottom10 } from '@styles/typography';
import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setDailyArticleGamesCategory, setShowedDailyDataCategory } from '../../redux/reducers/articlesSlice';
import LoadableImage from '../../services/LoadableImage';


const DATA = [
  {
    id: '1',
    imagePath: require('@assets/trash/card1.jpeg'),
    title: 'Gripping your fingers',
  },
  {
    id: '2',
    imagePath: require('@assets/trash/card2.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '3',
    imagePath: require('@assets/trash/card3.jpeg'),
    title: 'Picking stuff around',
  },
  {
    id: '4',
    imagePath: require('@assets/trash/card4.jpeg'),
    title: 'Gripping your fingers',
  },
  {
    id: '5',
    imagePath: require('@assets/trash/card5.jpeg'),
    title: 'Molding your hands',
  },
  {
    id: '6',
    imagePath: require('@assets/trash/card6.jpeg'),
    title: 'Picking stuff around',
  },
];

const DailyReads = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const articleDataall = useAppSelector(
    (state: any) => (state.articlesData.article.articles != '') ? JSON.parse(state.articlesData.article.articles) : state.articlesData.article.articles,
  );
  const articleData = articleDataall.filter((x:any)=> articleCategoryArray.includes(x.category))
  const RenderDailyReadItem = React.memo(({item, index}) => {
    return (
      <View>
      <DailyBox key={index}>
        <LoadableImage style={styles.cardImage} item={item}>
        {/* <ImageBackground source={{
          uri: item.cover_image.url,
        }} style={styles.cardImage}> */}
          <DailyArtTitle>
          <Heading3w>{item?.title}</Heading3w>
          </DailyArtTitle>
          <OverlayFaded>
          <LinearGradient colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,1)']} style={styles.linearGradient}>
            <Text >
          </Text>
          </LinearGradient>
          </OverlayFaded>
          </LoadableImage>
        {/* </ImageBackground> */}
        {/*Tag*/ }
        <DailyTag >
        <DailyTagText>{item?.hasOwnProperty('activity_category') ? t('homeScreentodaygame') : t('homeScreentodayarticle')}</DailyTagText>
        </DailyTag>
        {/*Parent Share , View Details*/ }
        <DailyAction>
          <FDirRow>
          <OuterIconRow>
                <OuterIconLeft>
                <Icon name="ic_sb_shareapp" size={24} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
            <Heading4>{t('homeScreenshareText')}</Heading4>
          </FDirRow>
          <FDirRow>
          <OuterIconRow>
                <OuterIconLeft>
                <Icon name="ic_view" size={13} color="#000" />
                </OuterIconLeft>
              </OuterIconRow>
              <Heading4>{t('homeScreenviewDetailsText')}</Heading4>
          </FDirRow>
         
        </DailyAction>
      </DailyBox>
      </View>
    );
  });
  const ActivitiesData = useAppSelector(
    (state: any) =>
      state.utilsData.ActivitiesData != '' ? JSON.parse(state.utilsData.ActivitiesData) : [],
  );
  const activityCategoryArray = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).activity_category,
  );
  const dailyDataCategory = useAppSelector(
    (state: any) => state.articlesData.dailyDataCategory,
  );
  const showedDailyDataCategory = useAppSelector(
    (state: any) => state.articlesData.showedDailyDataCategory,
  );
  const [dataToShowInList,setDataToShowInList] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      console.log(dailyDataCategory,"--showedDailyDataCategory--",showedDailyDataCategory);
      // dispatch(setShowedDailyDataCategory({advice: [] , games: []}));

      if(dailyDataCategory){
        const currentIndex = articleCategoryArray.findIndex((_item: any) => _item === dailyDataCategory.advice);
        // const currentIndex = articleCategoryArray.findIndex((_item: any) => _item === 1);
        const nextIndex = (currentIndex + 1) % articleCategoryArray.length;
        let categoryArticleData = articleData.filter((x:any)=>x.category == articleCategoryArray[nextIndex]);
        // let obj1 = categoryArticleData.filter( ( el:any ) => !showedDailyDataCategory.advice.includes( el.id ) );
        let obj1 = categoryArticleData.filter((i:any) => !showedDailyDataCategory.advice.find((f:any) => f === i.id));
        let advicearray:any=[];
        console.log(obj1,"--hello");
        // advicearray = [...showedDailyDataCategory.advice];
        if(obj1.length == 0){
          // advicearray = showedDailyDataCategory.advice.filter( ( el:any ) => !categoryArticleData.includes( el.id ) );
          let abc = showedDailyDataCategory.advice.filter((i:any) => !categoryArticleData.find((f:any)=>f.id === i));
          advicearray = [...abc]
        }else {
          advicearray = [...showedDailyDataCategory.advice]
        }
        console.log("advicearray---",advicearray);
        categoryArticleData = categoryArticleData.filter((i:any) => !advicearray.find((f:any) => f === i.id));
        console.log(categoryArticleData,"--arr1--",articleCategoryArray[nextIndex]);
        const articleDataToShow = categoryArticleData[Math.floor(Math.random() * categoryArticleData.length)];
        console.log(advicearray,"--articleDataToShow---",articleDataToShow);

        const currentIndex2 = activityCategoryArray.findIndex((_item: any) => _item.id === dailyDataCategory.games);
        const nextIndex2 = (currentIndex2 + 1) % activityCategoryArray.length;
        let categoryActivityData = ActivitiesData.filter((x:any)=>x.activity_category == activityCategoryArray[nextIndex2].id);
        let obj2 = categoryActivityData.filter((i:any) => !showedDailyDataCategory.games.find((f:any) => f === i.id));
        let gamesarray:any=[];
        if(obj2.length == 0){
          let abc = showedDailyDataCategory.games.filter((i:any) => !categoryActivityData.find((f:any)=>f.id === i));
          gamesarray = [...abc]
        }else {
          gamesarray = [...showedDailyDataCategory.games]
        }
        console.log("gamesarray---",gamesarray);
        categoryActivityData = categoryActivityData.filter((i:any) => !gamesarray.find((f:any) => f === i.id));
        console.log(categoryActivityData,"--arr--",activityCategoryArray[nextIndex2]);
        const activityDataToShow = categoryActivityData[Math.floor(Math.random() * categoryActivityData.length)];
        console.log("activityDataToShow---",activityDataToShow);
        advicearray.push(articleDataToShow?.id);
        gamesarray.push(activityDataToShow?.id);
        console.log(gamesarray,"--updatedAdviceArr--",advicearray);
        var data:any = [];
        data.push(articleDataToShow);
        data.push(activityDataToShow);
        setDataToShowInList(data);
        dispatch(setDailyArticleGamesCategory({advice: articleCategoryArray[nextIndex] , games: activityCategoryArray[nextIndex2].id}));
        dispatch(setShowedDailyDataCategory({advice: advicearray , games: gamesarray}));
        console.log(dataToShowInList);
      }

    }, [])
  );
  return (
    <>
      <BgSecondaryTint>
        <MainContainer>
          <ShiftFromTopBottom10>
            <Heading2>{t('homeScreendailyReadsTitle')}</Heading2>
        </ShiftFromTopBottom10>
        <View style={{marginLeft:-7,marginRight:-7}}>
        <FlatList
          data={dataToShowInList}
          horizontal
          renderItem={({item, index}) => <RenderDailyReadItem item={item} index={index} />}
          // renderItem={({item, index}) => renderDailyReadItem(item, index)}
          keyExtractor={(item) => item?.id}
        />
        </View>
        </MainContainer>
      </BgSecondaryTint>
    </>
  );
};

export default DailyReads;

const styles = StyleSheet.create({


  linearGradient: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 140,
    flex: 1,
    position: 'relative',
    // backgroundColor: 'red'
  },



});
