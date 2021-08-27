import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import {
  ButtonColTwo,
  ButtonContainer,
  ButtonContainerTwo,
  ButtonDelPress,
  ButtonPrimary,
  ButtonSecondaryTint,
  ButtonTertiary,
  ButtonText,
  ButtonTextSmLine
} from '@components/shared/ButtonGlobal';
import {
  FormContainer,
  FormDateAction,
  FormDateText,
  FormInputBox,
  FormInputGroup,
  FormInputText,
  TextAreaBox
} from '@components/shared/ChildSetupStyle';
import { MainContainer } from '@components/shared/Container';
import {
  FDirRow,
  FlexCol,
  FlexFDirRowSpace
} from '@components/shared/FlexBoxStyle';
import {
  HeaderActionView,
  HeaderIconView,
  HeaderRowView,
  HeaderTitleView
} from '@components/shared/HeaderContainerStyle';
import Icon from '@components/shared/Icon';
import ModalPopupContainer, {
  ModalPopupContent,
  PopupClose,
  PopupCloseContainer,
  PopupOverlay
} from '@components/shared/ModalPopupStyle';
import {
  RadioBoxContainer,
  RadioInnerBox,
  RadioOuter
} from '@components/shared/radio';
import ToggleRadios from '@components/ToggleRadios';
import { RootStackParamList } from '@navigation/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Heading2,
  Heading3,
  Heading3Center,
  Heading4Regular,
  ShiftFromTopBottom10
} from '@styles/typography';
import { DateTime } from 'luxon';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../../App';
import {
  maxCharForRemarks,
  measurementPlaces
} from '../../assets/translations/appOfflineData/apiConstants';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import {
  ChildEntity,
  ChildEntitySchema
} from '../../database/schema/ChildDataSchema';
import { setActiveChildData } from '../../redux/reducers/childSlice';
import {
  setInitialHeightValues,
  setInitialWeightValues
} from '../../services/growthService';
import analytics from '@react-native-firebase/analytics';
import { formatStringDate } from '../../services/Utils';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GROWTH_MEASUREMENT_ADDED } from '@assets/data/firebaseEvents';
import { getMeasuresForDate, isGrowthMeasureExistForDate, isVaccineMeasureExistForDate } from '../../services/measureUtils';
type ChildSetupNavigationProp = StackNavigationProp<RootStackParamList>;
type Props = {
  navigation: ChildSetupNavigationProp;
};

const AddNewChildgrowth = ({route, navigation}: any) => {
  const {t} = useTranslation();
  const {headerTitle, editGrowthItem} = route.params;
  if (editGrowthItem) {
  console.log('editGrowthItem', editGrowthItem);
  }
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode,
  );
  const [isMeasureDatePickerVisible, setMeasureDatePickerVisibility] = useState(false);
  const handleMeasureConfirm = (event:any) => {
    const date=event;
    console.log("A date has been picked: ", date);
    onmeasureDateChange(event,date);
    setMeasureDatePickerVisibility(false);
  };

  const themeContext = useContext(ThemeContext);
  const headerColor = themeContext.colors.CHILDGROWTH_COLOR;
  const backgroundColor = themeContext.colors.CHILDGROWTH_TINTCOLOR;
  const [measureDate, setmeasureDate] = useState<DateTime>(
    editGrowthItem ? editGrowthItem.measurementDate : null,
  );
  const [showmeasureDate, setmeasureDateShow] = useState<Boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateduuid, setUpdateduuid] = useState<string>(
    editGrowthItem ? editGrowthItem.uuid : uuidv4(),
  );
  const measurePlaces = measurementPlaces([
    t('growthScreendoctorMeasurePlace'),
    t('growthScreenhomeMeasurePlace'),
  ]);
  // measurePlaces =  measurePlaces.map((v) => ({ ...v, title: v.title }))
  const [weightValue, setWeightValue] = useState(
    editGrowthItem ? editGrowthItem.weight : 0,
  );
  const [heightValue, setHeightValue] = useState(
    editGrowthItem ? editGrowthItem.height : 0,
  );
  const [remarkTxt, handleDoctorRemark] = useState<string>(
    editGrowthItem ? editGrowthItem.doctorComment : '',
  );
  const [measurePlace, setMeasurePlace] = useState<number>(
    editGrowthItem ? editGrowthItem.measurementPlace : null,
  );
  const [defaultMeasurePlace, setDefaultMeasurePlace] = useState<any>(
    editGrowthItem
    ? measurePlaces[editGrowthItem.measurementPlace]
    : null
  );
  
 
  const [dateTouched, setDateTouched] = useState<Boolean>(false);
  //set initvalue here for edit
  const onmeasureDateChange = (event: any, selectedDate: any) => {
    console.log(DateTime.fromJSDate(selectedDate), 'new date', selectedDate);
    setmeasureDateShow(false);
    if (selectedDate) {
      setmeasureDate(DateTime.fromJSDate(selectedDate));
      setDateTouched(true);
      if(editGrowthItem){
        if(isGrowthMeasureExistForDate(DateTime.fromJSDate(selectedDate),activeChild)){
          //data already exist, reset measuredate it to edit measures’ date
          Alert.alert(t('alertForModifyMeasures'),
        t('alertForModifyMeasuresTitle'),
        [
          {
            text: t('alertForModifyMeasuresOk'),
            onPress: () => {
              setmeasureDate(editGrowthItem.measurementDate)
            },
            style: "cancel",
          },
        ],
        {
          cancelable: false,
          // onDismiss: () =>
          //   Alert.alert(
          //     "This alert was dismissed by tapping outside of the alert dialog."
          //   ),
        })
        }else{
          //if editing existing measure where only vacccines were added.
        if(isVaccineMeasureExistForDate(DateTime.fromJSDate(selectedDate),activeChild)){
          // allow adding growth values for that vaccine measure
          console.log("in else only if vaccines exist")
        }else{
          // add new measure
        }
      }
      }else{
      if(isGrowthMeasureExistForDate(DateTime.fromJSDate(selectedDate),activeChild)){
        Alert.alert(t('alertForModifyMeasures'),
        t('alertForModifyMeasuresTitle'),
        [
          {
            text: t('alertForModifyMeasuresOk'),
            onPress: () => {
             const existingMeasure = getMeasuresForDate(DateTime.fromJSDate(selectedDate),activeChild)
             console.log(existingMeasure);
             setMeasurePlace(existingMeasure.measurementPlace)
             setWeightValue(existingMeasure.weight)
             setHeightValue(existingMeasure.height)
             handleDoctorRemark(existingMeasure.doctorComment)
             setDefaultMeasurePlace(measurePlaces[existingMeasure.measurementPlace])
            },
            style: "cancel",
          },
        ],
        {
          cancelable: false,
          // onDismiss: () =>
          //   Alert.alert(
          //     "This alert was dismissed by tapping outside of the alert dialog."
          //   ),
        })
      }
    }
      
     
    }
  };
  const getCheckedGrowthPlace = (checkedItem: any) => {
    // console.log(checkedItem);
    setMeasurePlace(checkedItem.id);
    // setDefaultMeasurePlace(measurePlaces[checkedItem.id])
  };
  const activeChild = useAppSelector((state: any) =>
    state.childData.childDataSet.activeChild != ''
      ? JSON.parse(state.childData.childDataSet.activeChild)
      : [],
  );
  const dispatch = useAppDispatch();
  const child_age = useAppSelector((state: any) =>
    state.utilsData.taxonomy.allTaxonomyData != ''
      ? JSON.parse(state.utilsData.taxonomy.allTaxonomyData).child_age
      : [],
  );
  const luxonLocale = useAppSelector(
    (state: any) => state.selectedCountry.luxonLocale,
  );
  // console.log(activeChild,"in add new");
  // const getDefaultGrowthPlace = () => {
  //   return editGrowthItem
  //     ? measurePlaces[editGrowthItem.measurementPlace]
  //     : measurePlaces[measurePlace];
      
  //   // if in edit mode return value else return null
  // };

  const isFormFilled = () => {
    // console.log(measureDate, measurePlace, heightValue, weightValue);
    if (measureDate) {
      if (measurePlace != null) {
        if (measurePlace == 0) {
          if (heightValue && weightValue) {
            return false;
          } else {
            return true;
          }
        } else {
          if (heightValue && weightValue) {
            return false;
          } else {
            return true;
          }
          // doctor remark not required for measurement at home
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  const minChildGrwothDate =
    activeChild.birthDate != '' &&
    activeChild.birthDate != null &&
    activeChild.birthDate != undefined
      ? activeChild.birthDate
      : new Date();
  // console.log(minChildGrwothDate);
  React.useEffect(() => {
    if (route.params?.weight) {
      // console.log(route.params?.weight, 'from route');
      setWeightValue(route.params?.weight);
    }
    if (route.params?.height) {
      // console.log(route.params?.height);
      setHeightValue(route.params?.height);
    }
  }, [route.params?.weight, route.params?.height]);
const deleteGrowth = async()=>{
  console.log(editGrowthItem,"deleteGrowth")
  const measurementDateParam = editGrowthItem
  ? dateTouched
    ? measureDate?.toMillis()
    : editGrowthItem.measurementDate
  : measureDate?.toMillis();
const titleDateInMonthParam = editGrowthItem
  ? dateTouched
    ? measureDate.toFormat('MM')
    : editGrowthItem.titleDateInMonth
  : measureDate.toFormat('MM');
    if(editGrowthItem.didChildGetVaccines == true){
        //delete weight,height,doctorComment and mark isChildMeasured false
        const growthValues = {
          uuid: editGrowthItem.uuid,
          isChildMeasured: false,
          weight: "",
          height: "",
          measurementDate: measurementDateParam,
          titleDateInMonth: titleDateInMonthParam.toString(),
          didChildGetVaccines: editGrowthItem.didChildGetVaccines,
          vaccineIds: editGrowthItem.vaccineIds,
          doctorComment: "",
          measurementPlace: editGrowthItem.measurementPlace,
        };
        console.log(growthValues,'updateInDeleteMeasure');
        let updateresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
          ChildEntitySchema,
          growthValues,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(updateresult, '..updateresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (updateresult?.length>0) {
          activeChild.measures = updateresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();
    }else{
        //delete measure obj
        let deleteresult = await userRealmCommon.deleteChildMeasures<ChildEntity>(
          ChildEntitySchema,
          editGrowthItem,
          'uuid ="' + activeChild.uuid + '"',
        );
        console.log(deleteresult, '..deleteresult..');
        //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
        if (deleteresult) {
          activeChild.measures = deleteresult;
          dispatch(setActiveChildData(activeChild));
          setModalVisible(false);
        }
        navigation.goBack();
        
    }

}
  const saveChildMeasures = async () => {
    // console.log(dateTouched,"dateTouched",measureDate);
    
    const measurementDateParam = editGrowthItem
      ? dateTouched
        ? measureDate?.toMillis()
        : editGrowthItem.measurementDate
      : measureDate?.toMillis();
    const titleDateInMonthParam = editGrowthItem
      ? dateTouched
        ? measureDate.toFormat('MM')
        : editGrowthItem.titleDateInMonth
      : measureDate.toFormat('MM');

    let updateItem = activeChild?.measures.find((item) => {
      // console.log(item.measurementDate);
      // console.log(DateTime.fromJSDate(new Date(item.measurementDate)).diff(DateTime.fromJSDate(new Date(measureDate)), 'days').toObject().days);
      return item
        ? Math.round(
            DateTime.fromJSDate(new Date(item.measurementDate))
              .diff(DateTime.fromJSDate(new Date(measureDate)), 'days')
              .toObject().days,
          ) == 0
        : null;
    });
    console.log(updateItem);
    // if date difference is 0 then update else create new
    if (updateItem != null) {
      console.log(updateItem.uuid, 'updatethisitem');
      //if updating anything from growth,vaccine details goes as it is without change
      const growthValues = {
        uuid: updateItem.uuid,
        isChildMeasured: true,
        weight: String(weightValue),
        height: String(heightValue),
        measurementDate: measurementDateParam,
        titleDateInMonth: titleDateInMonthParam.toString(),
        didChildGetVaccines: updateItem.didChildGetVaccines,
        vaccineIds: updateItem.vaccineIds,
        doctorComment: remarkTxt,
        measurementPlace: measurePlace,
      };
      console.log(growthValues);
      let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
        ChildEntitySchema,
        growthValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      console.log(createresult, '..createresult..');
      //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
      if (createresult?.length > 0) {
        activeChild.measures = createresult;
        dispatch(setActiveChildData(activeChild));
      }
      navigation.goBack();
    } else {
      const growthValues = {
        uuid: updateduuid,
        isChildMeasured: true,
        weight: String(weightValue),
        height: String(heightValue),
        measurementDate: measurementDateParam,
        titleDateInMonth: titleDateInMonthParam.toString(),
        didChildGetVaccines: false,
        vaccineIds: '',
        doctorComment: remarkTxt,
        measurementPlace: measurePlace,
      };
      console.log(growthValues,'addthisitem');
      let createresult = await userRealmCommon.updateChildMeasures<ChildEntity>(
        ChildEntitySchema,
        growthValues,
        'uuid ="' + activeChild.uuid + '"',
      );
      console.log(createresult, '..createresult..');
      if (createresult?.length > 0) {
        activeChild.measures = createresult;
        dispatch(setActiveChildData(activeChild));
         analytics().logEvent(GROWTH_MEASUREMENT_ADDED, {age_id:activeChild?.taxonomyData?.id,measured_at:measurePlace==0?'doctor':'home'})
      }
      //setActiveChild(languageCode,activeChild.uuid, dispatch, child_age);
      navigation.goBack();
    }
    // }
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: headerColor}}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <ScrollView nestedScrollEnabled={true}>
          <HeaderRowView
            style={{
              backgroundColor: headerColor,
              maxHeight: 50,
            }}>
            <HeaderIconView>
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name={'ic_back'} color="#000" size={15} />
              </Pressable>
            </HeaderIconView>
            <HeaderTitleView>
              <Heading2 numberOfLines={1}>{headerTitle}</Heading2>
            </HeaderTitleView>
            {editGrowthItem ? (
              <HeaderActionView>
                <ButtonDelPress
                  onPress={() => {
                    setModalVisible(true);
                  }}>
                  <ButtonTextSmLine>{t('growthScreendeletebtnText')}</ButtonTextSmLine>
                </ButtonDelPress>
              </HeaderActionView>
            ) : null}
          </HeaderRowView>
          <FlexCol>
            <MainContainer>
              <FormInputGroup onPress={() => {
                setmeasureDateShow(true);
                if(Platform.OS == 'ios'){
                setMeasureDatePickerVisibility(true);
                }
                }}>
                <FormInputText>
                  {t('growthScreendateMeasurementText')}
                </FormInputText>
                {Platform.OS != 'ios' ? (
                  <FormInputBox>
                    <FormDateText>
                      <Text>
                        {' '}
                        {measureDate
                          ? 
                          // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                          //     'dd/MM/yyyy',
                          //   )
                          formatStringDate(measureDate,luxonLocale)
                          : t('growthScreenenterDateMeasurementText')}
                      </Text>
                      {showmeasureDate && (
                        <DateTimePicker
                          testID="measureDatePicker"
                          value={
                            editGrowthItem ? new Date(measureDate) : new Date()
                          }
                          mode={'date'}
                          display="default"
                          maximumDate={new Date()}
                          minimumDate={new Date(minChildGrwothDate)}
                          onChange={onmeasureDateChange}
                        />
                      )}
                    </FormDateText>
                    <FormDateAction>
                      <Icon name="ic_calendar" size={20} color="#000" />
                    </FormDateAction>
                  </FormInputBox>
                ) : (
                  <FormInputBox>
                        <FormDateText>
                      <Text>
                        {' '}
                        {measureDate
                          ? 
                          // DateTime.fromJSDate(new Date(measureDate)).toFormat(
                          //     'dd/MM/yyyy',
                          //   )
                          formatStringDate(measureDate,luxonLocale)
                          : t('growthScreenenterDateMeasurementText')}
                      </Text>
                  {/* <DateTimePicker
                    testID="measureDatePicker"
                    value={editGrowthItem ? new Date(measureDate) : new Date()}
                    mode={'date'}
                    display="default"
                    maximumDate={new Date()}
                    minimumDate={new Date(minChildGrwothDate)}
                    onChange={onmeasureDateChange}
                    style={{backgroundColor: 'white', flex: 1}}
                  /> */}
                     <DateTimePickerModal
              isVisible={isMeasureDatePickerVisible}
              mode="date"
              onConfirm={handleMeasureConfirm}
              date={editGrowthItem ? new Date(measureDate) : new Date()}
              onCancel={() => {
                // Alert.alert('Modal has been closed.');
                setMeasureDatePickerVisibility(false);
              }}
           maximumDate={new Date()}
           minimumDate={new Date(minChildGrwothDate)}
              />
</FormDateText>

                  <FormDateAction>
                  <Icon name="ic_calendar" size={20} color="#000" />
                </FormDateAction>
                </FormInputBox>
                 
                )}
              </FormInputGroup>
              <View></View>
              <FormContainer>
                <FormInputText>
                  <Heading3>{t('growthScreenwhereMeasured')}</Heading3>
                </FormInputText>

                <ToggleRadios
                  options={measurePlaces}
                  defaultValue={defaultMeasurePlace}
                  tickbgColor={headerColor}
                  tickColor={'#000'}
                  getCheckedItem={getCheckedGrowthPlace}
                />
              </FormContainer>

              <FormContainer>
                <FormInputText>
                  {t('growthScreenenterMeasuresText')}
                </FormInputText>
                <RadioBoxContainer>
                  <FDirRow>
                    <RadioOuter>
                      <RadioInnerBox
                        onPress={() => {
                          navigation.navigate('AddNewChildWeight', {
                            prevRoute: 'AddNewChildgrowth',
                            headerColor,
                            backgroundColor,
                            weightValue: setInitialWeightValues(weightValue),
                          });
                        }}>
                        <FlexFDirRowSpace>
                          <Heading3>
                            {weightValue ? weightValue : t('growthScreenwText')}
                          </Heading3>
                          <Heading4Regular>
                            {t('growthScreenkgText')}
                          </Heading4Regular>
                        </FlexFDirRowSpace>
                      </RadioInnerBox>
                    </RadioOuter>
                    <RadioOuter>
                      <RadioInnerBox
                        onPress={() => {
                          navigation.navigate('AddNewChildHeight', {
                            prevRoute: 'AddNewChildgrowth',
                            headerColor,
                            backgroundColor,
                            heightValue: setInitialHeightValues(heightValue),
                          });
                        }}>
                        <FlexFDirRowSpace>
                          <Heading3>
                            {heightValue ? heightValue : t('growthScreenhText')}
                          </Heading3>
                          <Heading4Regular>
                            {t('growthScreencmText')}
                          </Heading4Regular>
                        </FlexFDirRowSpace>
                      </RadioInnerBox>
                    </RadioOuter>
                  </FDirRow>
                </RadioBoxContainer>
              </FormContainer>

              <FormContainer>
                <FormInputText>
                  {t('growthScreenenterDoctorRemarkText')}
                </FormInputText>
                <TextAreaBox>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={maxCharForRemarks}
                    clearButtonMode="always"
                    defaultValue={remarkTxt}
                    multiline={true}
                    onChangeText={(text) => handleDoctorRemark(text)}
                    placeholder={t(
                      'growthScreenenterDoctorRemarkTextPlaceHolder',
                    )}
                    allowFontScaling={false} 
                  />
                </TextAreaBox>
              </FormContainer>

              <ShiftFromTopBottom10>
                <Text>{t('growthScreennewGrowthBottomText')}</Text>
              </ShiftFromTopBottom10>
            </MainContainer>
          </FlexCol>
          <ButtonContainer>
            <ButtonTertiary
              disabled={isFormFilled()}
              onPress={(e) => {
                e.stopPropagation();
                saveChildMeasures().then(() => {});
              }}>
              <ButtonText numberOfLines={2}>{t('growthScreensaveMeasures')}</ButtonText>
            </ButtonTertiary>
          </ButtonContainer>
          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // Alert.alert('Modal has been closed.');
              setModalVisible(false);
            }}
            onDismiss={() => {
              setModalVisible(false);
            }}>
            <PopupOverlay>
              <ModalPopupContainer>
                <PopupCloseContainer>
                  <PopupClose
                    onPress={() => {
                      setModalVisible(false);
                    }}>
                    <Icon name="ic_close" size={16} color="#000" />
                  </PopupClose>
                </PopupCloseContainer>
                <ShiftFromTopBottom10>
                  <ModalPopupContent>
                    <Heading3Center>{t('growthDeleteWarning')}</Heading3Center>
                  </ModalPopupContent>
                </ShiftFromTopBottom10>
                <ButtonContainerTwo>
                  <ButtonColTwo>
                    <ButtonSecondaryTint
                      onPress={() => {
                        setModalVisible(false);
                      }}>
                      <ButtonText numberOfLines={2}>{t('growthDeleteOption1')}</ButtonText>
                    </ButtonSecondaryTint>
                  </ButtonColTwo>

                  <ButtonColTwo>
                    <ButtonPrimary
                      onPress={() => {
                        deleteGrowth();
                      }}>
                      <ButtonText>{t('growthDeleteOption2')}</ButtonText>
                    </ButtonPrimary>
                  </ButtonColTwo>
                </ButtonContainerTwo>
              </ModalPopupContainer>
            </PopupOverlay>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AddNewChildgrowth;
