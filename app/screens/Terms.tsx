import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import OverlayLoadingComponent from '@components/OverlayLoadingComponent';
import {
  ButtonPrimary, ButtonRow,
  ButtonUpperCaseText
} from '@components/shared/ButtonGlobal';
import Checkbox, { CheckboxActive, CheckboxItem, FormOuterCheckbox } from '@components/shared/CheckboxStyle';
import { LabelTextTerms } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer, { OnboardingTermsHead } from '@components/shared/OnboardingContainer';
import { RootStackParamList } from '@navigation/types';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../App';
import { appConfig } from '../assets/translations/appOfflineData/apiConstants';
import { setAcceptTerms } from '../redux/reducers/utilsSlice';
import { Heading2Centerw, ShiftFromTop15, SideRightSpacing20, SideSpacing10 } from '../styles/typography';
import { bgcolorWhite2, secondaryBtnColor } from '@styles/style';
import VectorImage from 'react-native-vector-image';
import { activityLogo, adviceLogo, bebboLogoShapeNew, toolsLogo } from '@dynamicImportsClass/dynamicImports';
import FeatureTCView from '@components/shared/FeaturesTCView';


type TermsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;

type Props = {
  navigation: TermsNavigationProp;
};
const item = {
  image: bebboLogoShapeNew,
  advice: adviceLogo,
  tools: toolsLogo,
  activity: activityLogo
};
const styles = StyleSheet.create({
  checkboxStyle: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  },

  containerView: {
    backgroundColor: bgcolorWhite2,
    padding:16,
    flex: 1
  },
  containerView2: {
    marginTop: 30,
  },
  privacyText: {
    color: secondaryBtnColor,
    fontWeight: "700"
  },
  scrollViewStyle: {
    padding: 0
  },
  vectorImageView: {
    marginTop:50
  },
  contentDataView:{
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    backgroundColor:'red',
    flex:1
  }

})
const Terms = ({ navigation }: Props): any => {
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext?.colors.PRIMARY_REDESIGN_COLOR;
  const termsTextColor = themeContext?.colors?.TERMS_TEXTCOLOR;

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(true);
  const isButtonDisabled = (toggleCheckBox == false)
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const goToPrivacyPolicy = (): any => {
    navigation.navigate('PrivacyPolicy');
  };
  const goToTerms = (): any => {
    navigation.navigate('TermsPage');
  };
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const dispatch = useAppDispatch();
  useFocusEffect(
    React.useCallback(() => {
      setLoading(false);
    }, [languageCode])
  );
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        navigation.dispatch((state: any) => {
          // Remove the home route from the stack
          const routes = state.routes.filter((r: any) => r.name !== 'LoadingScreen');

          return CommonActions.reset({
            ...state,
            routes,
            index: routes.length - 1,
          });
        });
      }, 500);
    }, [])
  );
  const acceptTermsFlag = useAppSelector(
    (state: any) =>
      state.utilsData.acceptTerms
  );
  const apiJsonData = [
    {
      apiEndpoint: appConfig.videoArticles,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.dailyMessages,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.activities,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.surveys,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestones,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childDevelopmentData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinations,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthCheckupData,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.vaccinePinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.childGrowthPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.healthcheckupPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.faqPinnedContent,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.milestoneRelatedArticle,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.standardDeviation,
      method: 'get',
      postdata: {},
      saveinDB: true,
    },
    {
      apiEndpoint: appConfig.faqs,
      method: 'get',
      postdata: {},
      saveinDB: true,
    }
    // survey,child dev,vaccine,healthcheckup,growth,activities,
    // pinned for all 4 tools
  ];
  const acceptTerms = async (): Promise<any> => {
    if (acceptTermsFlag == false) {
      dispatch(setAcceptTerms(true));
    }
    navigation.navigate('LoadingScreen', {
      apiJsonData: apiJsonData,
      prevPage: 'Terms'
    });
  };

  return (
    <>
     <View style={styles.containerView}>
        <FocusAwareStatusBar
          animated={true}
          backgroundColor={headerColor}
        />
        <OnboardingContainer>
         <OnboardingTermsHead>
         <OverlayLoadingComponent loading={loading} />

            <View style={styles.vectorImageView}>
              <VectorImage source={item.image} />
            </View>

            <ShiftFromTop15>
              <Heading2Centerw>{t('walkthroughTextssubtitle0')}</Heading2Centerw>
            </ShiftFromTop15>
            
          
                <View style={styles.containerView2}>
                  <FeatureTCView
                    title={t('walkthroughTextstitle3').toString()}
                    subTitle={t('walkthroughTextssubtitle3').toString()}
                    iconname={item.advice}
                  />
                  <FeatureTCView
                    title={t('walkthroughTextstitle2').toString()}
                    subTitle={t('walkthroughTextssubtitle2').toString()}
                    iconname={item.tools}
                  />
                  <FeatureTCView
                    title={t('walkthroughTextstitle1').toString()}
                    subTitle={t('walkthroughTextssubtitle1').toString()}
                    iconname={item.activity}
                  />

                </View>

     

         </OnboardingTermsHead>
   
         
         
        </OnboardingContainer>
        <SideSpacing10>
        <ButtonRow>
            <FormOuterCheckbox
              onPress={(): any => {
                setToggleCheckBox(!toggleCheckBox);
              }}>
              <CheckboxItem>
                <View>
                  {toggleCheckBox ? (
                    <CheckboxActive>
                      <Icon name="ic_tick" size={12} color="#fff" />
                    </CheckboxActive>
                  ) : (
                    <Checkbox></Checkbox>
                  )}
                </View>
              </CheckboxItem>


              <SideRightSpacing20>
                <LabelTextTerms>
                  {t('tNccheckbox2')}{' '}

                  <LabelTextTerms onPress={goToPrivacyPolicy} style={styles.privacyText}>
                    {t('tNcprivacyPolicyTitle')}{' '}
                  </LabelTextTerms>
                  {t('childInfoAndText')}{' '}
                  <LabelTextTerms onPress={goToTerms} style={styles.privacyText}>
                    {t('tNcheader')}
                  </LabelTextTerms>
                  .
                </LabelTextTerms>
              </SideRightSpacing20>

              {/* <LabelText>{t('tNccheckbox2')} <CheckboxItemText onPress={goToTerms} style={styles.checkboxStyle}>{t('tncCheckBoxText')}</CheckboxItemText></LabelText> */}
            </FormOuterCheckbox>
            <ButtonPrimary
              disabled={isButtonDisabled}
              onPress={(): any => {
                acceptTerms();
              }}>
              <ButtonUpperCaseText numberOfLines={2}>{t('continueCountryLang')}</ButtonUpperCaseText>
            </ButtonPrimary>
          </ButtonRow>
        </SideSpacing10>
        </View>
    </>
  );
};

export default Terms;

