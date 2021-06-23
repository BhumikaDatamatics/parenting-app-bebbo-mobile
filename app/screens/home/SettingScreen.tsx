import { localization } from '@assets/data/localization';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import BurgerIcon from '@components/shared/BurgerIcon';
import { ButtonLinkText, ButtonPrimary } from '@components/shared/ButtonGlobal';
import Icon, { OuterIconLeft, OuterIconRow } from '@components/shared/Icon';
import {
  LocalizationAction,
  LocalizationCol,
  LocalizationContainer,
  LocalizationcontentHead,
  LocalizationcontentResult,
  LocalizationRow
} from '@components/shared/OnboardingContainer';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { ButtonText } from '@styles/style';
import {
  Heading1, Heading2w, Heading3, Heading3Regular,
  Heading4,
  Heading6
} from '@styles/typography';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Switch } from 'react-native-gesture-handler';
import VectorImage from 'react-native-vector-image';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../../App';

type SettingScreenNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;
type Props = {
  navigation: SettingScreenNavigationProp;
};
type localizationType = {
  name: string;
  displayName: string;
  countryId: number;
  languages: {
    name: string;
    displayName: string;
    languageCode: string;
    locale: string;
  };
};
const SettingScreen = (props: any) => {
  const themeContext = useContext(ThemeContext);
  const primaryColor = themeContext.colors.PRIMARY_COLOR;
  const primaryTintColor = themeContext.colors.PRIMARY_TINTCOLOR;
  const trackTrueColor =primaryTintColor;
  const trackFalseColor = '#C8D6EE';
  const thumbTrueColor = primaryColor
  const thumbFalseColor ='#9598BE';
  const {t, i18n} = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [country, setCountry] = useState<any>('');
  const [language, setlanguage] = useState<any>('');
  const actionSheetRef = createRef<any>();
  const countryId = useAppSelector(
    (state: any) => state.selectedCountry.countryId,
  );
  const [modalVisible, setModalVisible] = useState(false);
  // console.log(countryId);
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  useEffect(() => {
    const selectedCountry: any = localization.find(
      (country) => country.countryId === countryId,
    );
    setCountry(selectedCountry);
    const selectedLanguage: any = selectedCountry.languages.find(
      (language:any) => language.languageCode === languageCode,
    );
    setlanguage(selectedLanguage);
    // console.log(selectedCountry,selectedLanguage);
  }, []);
  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <FocusAwareStatusBar animated={true} backgroundColor={primaryColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: primaryColor,
            maxHeight: 50,
          }}>
          <View style={{flex: 1}}>
            <BurgerIcon />
          </View>
          <View style={{flex: 5,padding:8}}>
            <Heading2w> {t('settingScreen.headerTitle')}</Heading2w>
          </View>
        </View>
        <ScrollView style={{flex: 1}}>
          <View style={{padding: 15}}>
            <Heading1> {t('settingScreen.notiHeaderText')}</Heading1>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
              {t('settingScreen.notiType1')}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
              {t('settingScreen.notiType2')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
              {t('settingScreen.notiType3')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
              {t('settingScreen.notiType4')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                padding: 10,
              }}>
              <Text>
              {t('settingScreen.notiInfo')}
              </Text>
            </View>
          </View>
          <View style={{padding: 15}}>
            <Heading1>{t('settingScreen.dataSaverHeaderText')}</Heading1>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
              }}>
              <Switch
                trackColor={{false: trackFalseColor, true:trackTrueColor}}
                thumbColor={isEnabled ? thumbTrueColor : thumbFalseColor}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{alignSelf: 'flex-start'}}
              />
              <Text style={{alignSelf: 'flex-end'}}>
              {t('settingScreen.dataSaverSubText')}
              </Text>
            </View>
          </View>
          <View style={{padding: 15}}>
            <Heading1>{t('settingScreen.downldHeaderText')}</Heading1>
            <Heading4>{t('settingScreen.downldSubHeaderText')}</Heading4>
            <Heading6>{t('settingScreen.downldlast',{downloadDate: '17 dec 2020 02:32pm'})}</Heading6>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>{t('settingScreen.downldupdateBtn')}</ButtonText>
              </ButtonPrimary>
            </View>
            <Heading4>{t('settingScreen.downldSubHeader2Text')}</Heading4>
            <Heading6>{t('settingScreen.downldSubHeader3Text')}</Heading6>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>{t('settingScreen.downldallBtn')}</ButtonText>
              </ButtonPrimary>
            </View>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View style={{flexDirection: 'row'}}>
              <Heading1>{t('settingScreen.localizationHeader')}</Heading1>
              <LocalizationAction>
                <ButtonLinkText
                  onPress={() => props.navigation.navigate('CountrySelection')}>
                  <OuterIconRow>
                    <OuterIconLeft>
                      <Icon name="ic_edit" size={16} color="#000" />
                    </OuterIconLeft>
                  </OuterIconRow>
                </ButtonLinkText>
              </LocalizationAction>
            </View>
            <LocalizationContainer>
              <LocalizationRow>
                <LocalizationCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('localization.country')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{country.displayName}</Heading3>
                  </LocalizationcontentResult>
                </LocalizationCol>

                <LocalizationCol>
                  <LocalizationcontentHead>
                    <Heading3Regular>{t('localization.language')}</Heading3Regular>
                  </LocalizationcontentHead>
                  <LocalizationcontentResult>
                    <Heading3>{language.displayName}</Heading3>
                  </LocalizationcontentResult>
                </LocalizationCol>
              </LocalizationRow>
            </LocalizationContainer>
          </View>

          <View style={{padding: 15}}>
            <Heading1>{t('settingScreen.ieHeader')}</Heading1>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary
                onPress={() => {
                  actionSheetRef.current?.setModalVisible();
                }}>
                <ButtonText>{t('settingScreen.exportBtnText')}</ButtonText>
              </ButtonPrimary>
            </View>
            <View style={{width: '100%', marginTop: 30}}>
              <ButtonPrimary onPress={() => {}}>
                <ButtonText>{t('settingScreen.importBtnText')}</ButtonText>
              </ButtonPrimary>
            </View>
          </View>
          {/* 
          <Button
            title="Toggle"
            onPress={() =>
              props.navigation.dispatch(DrawerActions.toggleDrawer())
            }
          /> */}
          <ActionSheet ref={actionSheetRef}>
            <View>
              <View style={styles.modalView}>
                <Heading1>{t('settingScreen.exportOptionHeader')}</Heading1>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.item}>
                    <Icon name="ic_sb_shareapp" size={30} color="#000" />
                    <Text style={styles.modalText}>{t('settingScreen.shareBtntxt')}</Text>
                  </View>
                  <View style={styles.item}>
                    <VectorImage
                      source={require('@assets/svg/ic_gdrive.svg')}
                    />
                    <Text style={styles.modalText}>{t('settingScreen.gdriveBtntxt')}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ActionSheet>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SettingScreen;
const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    elevation: 5,
  },
  item: {
    flexDirection: 'column',
    borderBottomColor: '#EEE',
    borderBottomWidth: 2,
    alignItems: 'center',
    padding: 15,
  },
  modalText: {
    fontWeight: 'bold',
    marginVertical: 15,
  },
});
