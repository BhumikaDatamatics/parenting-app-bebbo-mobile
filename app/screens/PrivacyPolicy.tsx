import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ChildAddTop } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import OnboardingContainer from '@components/shared/OnboardingContainer';
import OnboardingHeading from '@components/shared/OnboardingHeading';
import { RootStackParamList } from '@navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading1w, ShiftFromTop5 } from '@styles/typography';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import HTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from 'styled-components/native';
import { useAppSelector } from '../../App';
type PrivacyPolicyNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChildSetup'
>;
type Props = {
  navigation: PrivacyPolicyNavigationProp;
};
const PrivacyPolicy = ({navigation}: Props) => {
  const {t} = useTranslation();
  const privacydata = useAppSelector(
    (state: any) => state.utilsData.privacypolicy.body,
  );
  const body =
    '<p><strong>Halo Beba/Parentbuddy Application Privacy Policy</strong></p>\n\n<p>This Privacy Policy applies to the HaloBeba/Parentbuddy application (hereinafter: The Application), a parenting application, that serves to provide information and guidance to parents of young children, 0-6 years old. It sets out how we collect, use and store your information and what steps we take to protect your information. </p>\n\n<p>Taking care of the information you provide is important for UNICEF (United Nations Children s Fund). </p>\n\n<p>Please read our Privacy Policy carefully before using the Application and refer to it regularly to check for updates. By accessing and using the Application, you agree to all provisions in this Privacy Policy. </p>\n\n<p>The Application is not storing any personally identifiable information on any external server automatically, except your email and name once you logged in using that method of registration.</p>\n\n<p>The Application is collecting anonymous data that will be used for analytics and to improve services we are offering to users. The application asks the user to agree about anonymous data collection. This is not mandatory.</p>\n\n<p> </p>\n\n<p><strong>What information do we collect through the Application?</strong><strong> </strong></p>\n\n<p>We obtain data  from various sources described below: </p>\n\n<p><strong>Anonymous data that we collect automatically from your use of the application</strong></p>\n\n<p>When you use the  Application, UNICEF and its third-party service providers may collect impersonal information about you through automated means, such as application logs, to be used only for background analytics and to improve features and services provided through the app. We use this anonymous information to track the overall number of users, the frequency of use of different features and the application content, with an aim to improve the app and provide functions and content that will respond to user interests.</p>\n\n<p><strong>Registration/Account Information </strong></p>\n\n<p>You have to register in the  Application before using its content or functional features.  You can register with your existing Google or Facebook account or by providing certain personally identifiable information such as your e-mail address and name. </p>\n\n<p>In order to present you with the content relevant for your child’s age and gender, the application will ask you to provide data on the date of birth of your child and her/his gender. If you choose to use functional features of the app, helping you to track growth, development, vaccinations, and health check-ups of your child, the app will ask you to enter growth measurements, assess developmental milestones, and enter information if the child received vaccines. </p>\n\n<p>If the user chooses to register using email and password, the Application will store email, password, first name, and last name.</p>\n\n<p>If the user chooses to log in using his social network accounts, no account login information is stored on the server.</p>\n\n<p><strong>Information and data storage</strong></p>\n\n<p>The application is not collecting any personally identifiable information except the user’s email and is not storing them on any external server automatically. All data entered into the Application are stored only on the user’s personal device. Users are fully responsible for any data stored on their devices, in line with respective Google and Apple privacy policies.</p>\n\n<p>You can learn more about Google’s and Apple privacy policies by going to:</p>\n\n<p><a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a></p>\n\n<p><a href="https://www.apple.com/legal/privacy">https://www.apple.com/legal/privacy</a></p>\n\n<p>The application consists of 2 unencrypted databases both located on the user’s personal smart device – Data and User. The Data database contains general application data like information about accessed articles and FAQ, while the User database contains all data about the child that parent entered into the application like checked milestones, vaccinations, etc.</p>\n\n<p>Users can always send requests through the application to delete accounts and all data located on the phone.  All Application data from the phone and CMS is automatically deleted per user request. In case the user registered in the application with email, that data (name and email) will be also deleted from the external server.</p>\n\n<p><strong>Data backup and synchronization between the parents</strong></p>\n\n<p>A parent can decide to backup all application data or to synchronize data with another parent.</p>\n\n<p>In the case that a user wants to back up the app data (e.g. in case that user wants to restore all data on another smart device) , and only upon action that only user can initiate manually, all textual data will be backed up and stored on user’s personal Google drive.</p>\n\n<p>In case of synchronization with another parent, data will be only temporally stored on user’s Google drive until synchronization got completed. In both cases, while en route to and from Google’s servers, all user’s files are encrypted with a 248-bit SSL/TLS key. Data on the cloud itself is protected with 128-bit AES encryption, in line with highest Google security standards.</p>\n\n<p><strong>User-Generated Content and Communications</strong> </p>\n\n<p> If you contact us directly by sending us mail or writing a comment, or we contact you and you chose to reply, we may receive more information about you. For example, when you contact us, we may receive your name, email address, phone number, the contents of a message or attachments that you may send to us, and other information you choose to provide.  </p>\n\n<p> </p>\n\n<p><strong>How do we use the information collected in the application?</strong></p>\n\n<p>We do not sell, trade, or otherwise transfer to outside parties user’s personally identifiable information. This does not include trusted third parties who assist us in operating our application, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>\n\n<p><strong>Communications </strong></p>\n\n<p>We might use your information to contact you in relation to content submitted by you to the application and user-service or technical-support purposes. </p>\n\n<p><strong>Analytics and improving the application</strong></p>\n\n<p>UNICEF and its service providers may use the information that are collecting in the application, such as user’s activities in the application or user’s answers through availibale surveys, to monitor and analyze usage of the application and to improve and enhance the Application and further advocate for any changes in the service.</p>\n\n<p><strong>Aggregated Data </strong></p>\n\n<p>We may de-identify and aggregate information collected in the application for statistical analysis and other lawful purposes, including in promotional or research activities. The results of these activities may be shared with third parties, such as our partners, supporters, educators and researchers through conferences, journals, and other publications. </p>\n\n<p><strong>Legal </strong></p>\n\n<p>We may use your personal information to enforce our Terms and Conditions of Application use to defend our legal rights, and to comply with our legal obligations and internal policies. </p>\n\n<p> </p>\n\n<p><strong>Third Parties Websites</strong><strong>, application, and services</strong></p>\n\n<p>The application may contain links to other websites or services that are not covered by this Privacy Policy. This Privacy Policy applies only to the processing of your information by UNICEF in connection with this application. It does not address, and we are not responsible for, the privacy, information, or other practices of any third party, including any third party operating any site or service to which the Application links. The inclusion of a link on this application does not imply endorsement of the linked site or service by UNICEF. Please be aware that the terms of this Privacy Policy do not apply to external websites or external content, or to any collection of data linked to external websites. </p>\n\n<p> </p>\n\n<p><strong>Notifications of Changes to the Privacy Policy</strong><strong> </strong></p>\n\n<p>We continuously review our security measures and our Privacy Policy and may modify our policies as we deem appropriate. If we make any changes to our privacy practices, such changes will be effective immediately upon posting them to the application. For this reason, we encourage you to regularly check our Privacy Policy. The “Last Updated” date at the bottom of this page indicates when this Privacy Policy was last revised. Your continued use of the application following these changes means that you accept the revised Privacy Policy. </p>\n\n<p> </p>\n\n<p><strong>Contact Us</strong><strong> </strong> </p>\n\n<p>Should you have questions or concerns related to privacy and use of personal data in the application, please feel free to contact us at halobeba@zdravlje.org.rs </p>\n\n<p> </p>\n\n<p><strong>Your consent</strong></p>\n\n<p>By using our application, you consent to our online privacy policy.</p>\n\n<p> </p>\n\n<p><strong>Last Updated: 04 August-2020</strong></p>';
  const contentWidth = useWindowDimensions().width;
  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.PRIMARY_COLOR;
  return (
    <>
    <View style={{flex:1,backgroundColor:headerColor}}>
    <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
      <OnboardingContainer>
        <OnboardingHeading>
          <ChildAddTop>
            <Heading1w>{t('tNcprivacyPolicyTitle')}</Heading1w>
            <ShiftFromTop5>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="ic_close" size={20} color="#FFF" />
              </Pressable>
            </ShiftFromTop5>
          </ChildAddTop>
        </OnboardingHeading>
        <ScrollView contentContainerStyle={{padding: 0}}>
          { privacydata != "" ? 
            <HTML
              source={{html: privacydata.replace(/>\s\s+</g, '>&shy; <')}}
              baseFontStyle={{fontSize: 16, color: '#ffffff'}}
              ignoredStyles={['color', 'font-size', 'font-family']}
            />
            : null 
          }
        </ScrollView>
      </OnboardingContainer>
      </View>
    </>
  );
};

export default PrivacyPolicy;
