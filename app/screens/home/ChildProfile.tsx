import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonLinkPress, ButtonTextMdLineL,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView
} from '@components/shared/Icon';
import {
  ParentData, ParentLabel, ParentListView, ParentRowView, ParentSection, ProfileActionView, ProfileContentView, ProfileIconView, ProfileLinkCol,
  ProfileLinkRow, ProfileLinkView, ProfileListDefault, ProfileListInner, ProfileListViewSelected, ProfileSectionView, ProfileTextView
} from '@components/shared/ProfileListingStyle';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2w,
  Heading3,
  Heading5,
  Heading5Bold,
  Heading6
} from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../App';
import { setActiveChild } from '../../services/childCRUD';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  navigation: NotificationsNavigationProp;
};

// const DATA = [
//   {
//     id: '1',
//     childname: 'Harvey',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '2',
//     childname: 'Donna',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '3',
//     childname: 'Michael',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '4',
//     childname: 'Rachel',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '5',
//     childname: 'Louis',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '6',
//     childname: 'Jessica',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '7',
//     childname: 'Samantha',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '8',
//     childname: 'Katrina',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '9',
//     childname: 'Sheila',
//     gender: 'Girl',
//     birthday: new Date(),
//   },
//   {
//     id: '10',
//     childname: 'Jeff',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
//   {
//     id: '11',
//     childname: 'Alex',
//     gender: 'Boy',
//     birthday: new Date(),
//   },
// ];
const ChildProfile = ({navigation}: Props) => {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const secopndaryColor = themeContext.colors.SECONDARY_COLOR;
  const secopndaryTintColor = themeContext.colors.SECONDARY_TINTCOLOR;
  const genders = useAppSelector(
    (state: any) =>
      JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender,
  );
  const dispatch = useAppDispatch();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getAllChildren(dispatch);
  //     getAllConfigData(dispatch);
  //   },[])
  // );
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );

  const allConfigData = useAppSelector((state: any) =>
    state.variableData?.variableData != ''
      ? JSON.parse(state.variableData?.variableData)
      : state.variableData?.variableData,
  );
  const userParentalRoleData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userParentalRole')
      : [];
  const userNameData =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'userName')
      : [];
  const currentActiveChildId =
    allConfigData?.length > 0
      ? allConfigData.filter((item) => item.key === 'currentActiveChildId')
      : [];
  //console.log(allConfigData,"..userParentalRole..")
  const currentActiveChild =
    currentActiveChildId?.length > 0 ? currentActiveChildId[0].value : null;
  //console.log(currentActiveChild,"..currentActiveChild..");
  const SortedchildList = [...childList].sort((a: any, b: any) => {
    if (a.uuid == currentActiveChild) return -1;
  });
  const renderChildProfile = (dispatch: any, data: any, index: number,genderName:string) => (
    
    <View key={index}>
      {currentActiveChild != '' &&
      currentActiveChild != null &&
      currentActiveChild != undefined &&
      currentActiveChild == data.uuid ? (
        <ProfileListViewSelected>
          <ProfileIconView>
            <Icon name="ic_baby" size={30} color="#000" />
          </ProfileIconView>
          <ProfileTextView>
            <ProfileSectionView>
              <Heading3>{data.name}</Heading3>
              <OuterIconLeft></OuterIconLeft>
              <Heading6>{genderName}</Heading6>
            </ProfileSectionView>
            <Heading5>{t('childProfileBornOn',{childdob:data.birthDate})}</Heading5>
            <ProfileLinkView>
              <ButtonTextSmLine
                onPress={() => {
                  data.index = index;
                  navigation.navigate('EditChildProfile', {childData: data});
                }}>
                <Text>{t('editProfileBtn')}</Text>
              </ButtonTextSmLine>
            </ProfileLinkView>
          </ProfileTextView>
          <ProfileActionView>
            <OuterIconRow>
              <OuterIconLeft>
                <TickView>
                  <Icon name="ic_tick" size={12} color="#009B00" />
                </TickView>
              </OuterIconLeft>
            </OuterIconRow>

            <Heading5Bold>{t('childActivatedtxt')}</Heading5Bold>
          </ProfileActionView>
        </ProfileListViewSelected>
      ) : (
        <ProfileListDefault
          style={{
            backgroundColor: secopndaryTintColor,
          }}>
          <ProfileListInner>
            <ProfileIconView>
              <Icon name="ic_baby" size={30} color="#000" />
            </ProfileIconView>
            <ProfileTextView>
              <ProfileSectionView>
                <Heading3>
                  {data.name != '' ? data.name : 'Child' + (index + 1)},
                </Heading3>
                <OuterIconLeft></OuterIconLeft>
                <Heading6>{genderName}</Heading6>
              </ProfileSectionView>
              <Heading5>{t('childProfileBornOn',{childdob:data.birthDate})}</Heading5>
              <ProfileLinkView>
                <ButtonTextSmLine
                  onPress={() => {
                    navigation.navigate('EditChildProfile', {childData: data});
                  }}>
                  <Text>{t('editProfileBtn')}</Text>
                </ButtonTextSmLine>
                <View>
                  <Text>|</Text>
                </View>
                <ButtonTextSmLine
                  onPress={() => {
                    setActiveChild(data.uuid);
                  }}>
                 {t('childActivatebtn')}
                </ButtonTextSmLine>
              </ProfileLinkView>
            </ProfileTextView>
            <ProfileActionView>
              {/* Pressable button */}
              <Text></Text>
            </ProfileActionView>
          </ProfileListInner>
        </ProfileListDefault>
      )}
    </View>
  );
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1, padding: 15}}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </Pressable>
          </View>
          <View style={{flex: 9, padding: 7}}>
            <Heading2w>{t('childProfileHeader')}</Heading2w>
          </View>
        </View>
        <View style={{margin: 15}}>
          <View style={{flexDirection: 'column'}}>
            <ScrollView style={{height: 'auto'}} nestedScrollEnabled={true}>
              {SortedchildList.length > 0
                ? SortedchildList.map((item: any, index: number) => {
                  const genderLocal=(genders?.length>0 && item.gender!="")?genders.find(genderset => genderset.id === item.gender).name:item.gender;
                  return renderChildProfile(dispatch, item, index,genderLocal);
                  })
                : null}
            </ScrollView>
            <ProfileLinkRow
              style={{
                backgroundColor: secopndaryTintColor,
              }}>
              <ProfileLinkCol>
                <ButtonLinkPress
                  onPress={() => {
                    navigation.navigate('EditChildProfile', {childData: null});
                  }}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={24} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>

                  <ButtonTextMdLineL>{t('childSetupListaddSiblingBtn')}</ButtonTextMdLineL>
                </ButtonLinkPress>
              </ProfileLinkCol>
              <ProfileLinkCol>
                <ButtonLinkPress
                  onPress={() => {
                    navigation.navigate('AddExpectingChildProfile');
                  }}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={24} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>

                  <ButtonTextMdLineL>{t('expectChildAddTxt2')}</ButtonTextMdLineL>
                </ButtonLinkPress>
              </ProfileLinkCol>
            </ProfileLinkRow>

            <ParentListView style={{backgroundColor: secopndaryTintColor}}>
              <ProfileContentView>
                <ProfileTextView>
                  <Heading3>{t('parentDetailsTxt')}</Heading3>
                </ProfileTextView>
                <ProfileActionView>
                  <ButtonLinkPress
                    onPress={() => {
                      navigation.navigate('EditParentDetails', {
                        userParentalRoleData:
                          userParentalRoleData?.length > 0
                            ? userParentalRoleData[0].value
                            : '',
                        parentEditName:
                          userNameData?.length > 0 ? userNameData[0].value : '',
                      });
                    }}>
                    <ButtonTextSmLine>{t('editProfileBtn')}</ButtonTextSmLine>
                  </ButtonLinkPress>
                </ProfileActionView>
              </ProfileContentView>

              <ProfileContentView>
                <ParentRowView>
                  <ParentSection>
                    <ParentLabel>
                      <Text>{t('parentRoleLabel')}</Text>
                    </ParentLabel>
                    <ParentData>
                      <Text>
                        {userParentalRoleData?.length > 0
                          ? userParentalRoleData[0].value
                          : ''}
                      </Text>
                    </ParentData>
                  </ParentSection>
                  <ParentSection>
                    <ParentLabel>
                      <Text>{t('parentNameLabel')}</Text>
                    </ParentLabel>
                    <ParentData>
                      <Text>
                        {userNameData?.length > 0 ? userNameData[0].value : ''}
                      </Text>
                    </ParentData>
                  </ParentSection>
                </ParentRowView>
              </ProfileContentView>
            </ParentListView>
            {/* <View style={{flexDirection: 'row'}}>
                  <View style={{padding: 10}}>
                    <Text>Name</Text>
                  </View>
                  <View style={{padding: 10}}>
                    <Text>{userNameData?.length>0?userNameData[0].value:''}</Text>
                  </View>
                </View> */}
          </View>
        </View>
        {/* </ScrollView> */}
        {/* </View> */}
      </SafeAreaView>
    </>
  );
};

export default ChildProfile;
