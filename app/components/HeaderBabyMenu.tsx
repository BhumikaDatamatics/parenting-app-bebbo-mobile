import Icon, {
  OuterIconLeft,
  OuterIconRow,
  TickView6,
  TickView4
} from '@components/shared/Icon';
import { ImageIcon } from '@components/shared/Image';
import { useNavigation } from '@react-navigation/native';
import {
  Heading3,
  Heading5,
  ShiftFromBottom10
} from '@styles/typography';
import { CHILDREN_PATH } from '@types/types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal, Platform, Pressable, StyleSheet, View} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../App';
import {
  getAllChildren,
  getAllConfigData,
  isFutureDate,
  setActiveChild
} from '../services/childCRUD';
import { getStatusBarHeight } from '../services/StatusBarHeight';
import { formatDate } from '../services/Utils';
import {
  ButtonContainer,
  ButtonLinkPress,
  ButtonPrimary,
  ButtonText,
  ButtonTextLine} from './shared/ButtonGlobal';
import { FDirRow, FlexColEnd } from './shared/FlexBoxStyle';
import { HeaderActionBox, HeaderActionView } from './shared/HeaderContainerStyle';
import {
  ProfileActionView,
  ProfileIconView,
  ProfileListView,
  ProfileListViewSelected,
  ProfileSectionView,
  ProfileTextView
} from './shared/ProfileListingStyle';
const headerHeight = 50;
const HeaderBabyMenu = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const genders = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_gender : [],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : [],
  );
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const currentActiveChild = activeChild.uuid;
  const child_age = useAppSelector(
    (state: any) =>
      state.utilsData.taxonomy.allTaxonomyData != '' ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age : [],
  );
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  const SortedchildList = [...childList].sort((a: any, b: any) => {
    if (a.uuid == currentActiveChild) return -1;
  });
  const renderChildItem = (dispatch: any, data: any, index: number) => {
    const genderLocal =
      genders?.length > 0 && data.gender != ''
        ? genders.find((genderset:any) => genderset.id === parseInt(data.gender)).name
        : '';
    const genderName: string = genderLocal;
    return (
      <View key={index}>
        {currentActiveChild != '' &&
          currentActiveChild != null &&
          currentActiveChild != undefined &&
          currentActiveChild == data.uuid ? (
          <ProfileListViewSelected>
            <ProfileIconView>
              {data.photoUri != '' ? (
                <ImageIcon
                  source={{ uri: 'file://' + CHILDREN_PATH + data.photoUri }}
                ></ImageIcon>
              ) : (
                <Icon name="ic_baby" size={30} color="#000" />
              )}
            </ProfileIconView>
            <ProfileTextView>
              <ProfileSectionView>
                <Heading3>{data.childName}
                {genderName!='' && genderName!=null && genderName!=undefined ?<Heading5 style={{fontWeight:'normal'}}>{', '+genderName}</Heading5>:null}
              </Heading3>
              </ProfileSectionView>
              <Heading5>
                {(data.birthDate != '' &&
                  data.birthDate != null &&
                  data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn', { childdob: data.birthDate != null ? formatDate(data.birthDate,luxonLocale) : '' }) : t('expectedChildDobLabel')}
              </Heading5>
            </ProfileTextView>
            <ProfileActionView>
              <FlexColEnd>
                <FDirRow>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <TickView6>
                        <Icon name="ic_activate_tag" size={11} color="#009B00" />
                      </TickView6>
                    </OuterIconLeft>
                  </OuterIconRow>
                </FDirRow>
              </FlexColEnd>
            </ProfileActionView>
          </ProfileListViewSelected>
        ) : (
          <ProfileListView>
            <ProfileIconView>
              {data.photoUri != '' ? (
                <ImageIcon
                  source={{ uri: 'file://' + CHILDREN_PATH + data.photoUri }}
                ></ImageIcon>
              ) : (
                <Icon name="ic_baby" size={30} color="#000" />
              )}
            </ProfileIconView>

            <ProfileTextView>
              <ProfileSectionView>
                <Heading3>{data.childName}
                {genderName!='' && genderName!=null && genderName!=undefined ?<Heading5 style={{fontWeight:'normal'}}>{', '+genderName}</Heading5>:null}
              </Heading3>
           
              </ProfileSectionView>
              <Heading5>
                {(data.birthDate != '' &&
                  data.birthDate != null &&
                  data.birthDate != undefined && !isFutureDate(data.birthDate)) ? t('childProfileBornOn', { childdob: data.birthDate != null ? formatDate(data.birthDate,luxonLocale) : '' }) : t('expectedChildDobLabel')}
              </Heading5>
            </ProfileTextView>
            <ProfileActionView>
              <FlexColEnd>
                <FDirRow>
                <Pressable style={{paddingTop:7,paddingBottom:7}}
                    onPress={() => {
                      setModalVisible(false);
                      props.setProfileLoading(true);
                      setTimeout(async()=>{
                      const setData=await setActiveChild(languageCode, data.uuid, dispatch, child_age,true);
                      if(setData=="activeset"){
                        props.setProfileLoading(false);
                       }
                      },0);
                    }}>     
                  <OuterIconRow>
                    <OuterIconLeft style={{paddingLeft:30}}>
                      <TickView4>
                      </TickView4>
                    </OuterIconLeft>
                  </OuterIconRow>
                  </Pressable>
                </FDirRow>
              </FlexColEnd>
            </ProfileActionView>
          </ProfileListView>
          
        )}
      </View>
    );
  };
  return (
    <>
      <Modal
        style={styles.mainModal}
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        onDismiss={() => {
          setModalVisible(false);
        }}>

           <View
            style={styles.modalView}
           >
            {SortedchildList.length > 0 ? (
              <View style={{ height: 'auto',minHeight:100, maxHeight: 150, backgroundColor:'transparent',zIndex:9999,position:'relative',width:"100%"}}>
                <FlatList
                  nestedScrollEnabled={true}
                  data={SortedchildList}
                  renderItem={({ item, index }: any) =>
                    // return a component using that data
                    renderChildItem(dispatch, item, index)
                  }
                  keyExtractor={(item: { uuid: any }) => item.uuid}
                />
              </View>
            ) : null}

            <ButtonContainer>
              <ShiftFromBottom10>
                <ButtonLinkPress
                  onPress={() =>{
                    setModalVisible(false);
                    navigation.navigate('EditChildProfile', { childData: null })
                  }
                  }>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_plus" size={20} color="#000" />
                    </OuterIconLeft>
                    <ButtonTextLine numberOfLines={2}>
                      {t('childSetupListaddSiblingBtn')}
                    </ButtonTextLine>
                  </OuterIconRow>
                </ButtonLinkPress>
              </ShiftFromBottom10>

              <ButtonPrimary
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('ChildProfileScreen')
                  }}>
                <ButtonText numberOfLines={2}>{t('manageProfileTxt')}</ButtonText>
              </ButtonPrimary>
            </ButtonContainer>
          </View>
        <View 
          style={styles.centeredView}>
            <View style={{flex:1,backgroundColor:'transparent'}}>
            <Pressable style={{backgroundColor:'transparent',zIndex:9999,height:headerHeight,position:'absolute',top:0,left:0,width:"100%"}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                    if (modalVisible) {
                      getAllChildren(dispatch,child_age,0);
                      getAllConfigData(dispatch);
                    }
                }}>
            </Pressable>
        </View>
        </View>
        <View style={{backgroundColor:'transparent',opacity:0.5,zIndex:2,position:'absolute',width:'100%',height:'100%'}} >
        <Pressable style={{backgroundColor:'transparent',width:'100%',height:'100%',position:'relative'}} 
        onPress={() => {
          setModalVisible(false);
        }}>
        </Pressable>
        </View>
      </Modal>

      <HeaderActionView>
        <HeaderActionBox
          onPress={() => {
           setModalVisible(!modalVisible);
            if (modalVisible) {
              getAllChildren(dispatch,child_age,0);
              getAllConfigData(dispatch);
            }
          }}>
          {activeChild.photoUri != '' ? (
            <ImageIcon
              source={{ uri: 'file://' + CHILDREN_PATH + activeChild.photoUri }}></ImageIcon>
          ) : (
            <Icon name="ic_baby" size={25} color={props.color || '#FFF'} />
          )}
        </HeaderActionBox>
      </HeaderActionView>
    </>
  );
};
export default HeaderBabyMenu;
const styles = StyleSheet.create({
  centeredView: {
    width:'100%',
    left:0,
    height:'100%',
    position:'relative',
    zIndex:1,
  },
  mainModal:{
   
  },
  modalView: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 0,
    borderColor: '#000',
    borderBottomWidth: 2,
    position:'relative',
    zIndex:3,
       ...Platform.select({
        ios: {
          top:getStatusBarHeight(0)>20?headerHeight-2:35,
          marginTop:getStatusBarHeight(0)>20?headerHeight-2:35
        },
      android: {
        marginTop:headerHeight,
      },
    })
  },

  modalText: {
    textAlign: 'center',
    borderBottomWidth: 2,
  },
  cardcontainer: {
    flexGrow: 1,
  },
});
