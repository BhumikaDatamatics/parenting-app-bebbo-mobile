import ChildDate from '@components/ChildDate';
import FocusAwareStatusBar from '@components/FocusAwareStatusBar';
import { ButtonPrimary, ButtonText } from '@components/shared/ButtonGlobal';
import { LabelText, TitleLinkSm } from '@components/shared/ChildSetupStyle';
import Icon from '@components/shared/Icon';
import { HomeDrawerNavigatorStackParamList } from '@navigation/types';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Heading2w, Heading3, Heading4 } from '@styles/typography';
import React, { createRef, useContext, useEffect } from 'react';
import {
  Alert,
  Image, Platform, Pressable,
  SafeAreaView,
  ScrollView, Text, TextInput,
  View
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { copyFile, DocumentDirectoryPath, exists, mkdir, unlink } from 'react-native-fs';
import ImagePicker, { Image as ImageObject } from 'react-native-image-crop-picker';
import { ThemeContext } from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../App';
import { userRealmCommon } from '../../database/dbquery/userRealmCommon';
import { ChildEntity, ChildEntitySchema } from '../../database/schema/ChildDataSchema';
import { deleteImageFile } from '../../downloadImages/ImageStorage';
import { addChild, deleteChild, getAllChildren, getAllConfigData, getNewChild } from '../../services/childCRUD';
import MediaPicker from '../../services/MediaPicker';

type NotificationsNavigationProp =
  StackNavigationProp<HomeDrawerNavigatorStackParamList>;

type Props = {
  route: any,
  navigation: NotificationsNavigationProp;
};
const EditChildProfile = ({ route, navigation }: Props) => {
const { childData } = route.params;
const childList = useAppSelector((state: any) =>
    state.childData.childDataSet.allChild != ''
      ? JSON.parse(state.childData.childDataSet.allChild)
      : state.childData.childDataSet.allChild,
  );
  console.log(childData,"..childData..");
  // console.log(childData.birthDate,"..birthObject..");
  const editScreen = childData?.uuid != "" ? true : false;
  const themeContext = useContext(ThemeContext);
  const dispatch = useAppDispatch();

  const headerColor = themeContext.colors.PRIMARY_COLOR;
  const SecondaryColor = themeContext.colors.SECONDARY_COLOR;
  const genders = ['boy', 'girl'];
  const imageOptions = [
    { id: 0, iconName: 'ic_trash', name: 'Remove Photo' },
    { id: 1, iconName: 'ic_camera', name: 'Camera' },
    { id: 2, iconName: 'ic_gallery', name: 'Gallery' },
  ];
  const actionSheetRef = createRef<any>();
  const [response, setResponse] = React.useState<any>(null);
  const [capturedPhoto, setCapturedImage] = React.useState(childData!=null ? `${DocumentDirectoryPath}/${childData.photoUri}` :'');
  const [photoUri, setphotoUri] = React.useState("");
  const [tempImage,cleanUPImage]= React.useState("");
  let initialData: any = {};
  const [birthDate, setBirthDate] = React.useState<Date>();
  const [name, setName] = React.useState(childData != null ? childData.name : '');
  const [plannedTermDate, setPlannedTermDate] = React.useState<Date>();
  const [isPremature, setIsPremature] = React.useState<string>('false');
  const uuid = childData != null ? childData.uuid : '';
  const sendData = (data: any) => { // the callback. Use a better name
    setBirthDate(data.birthDate);
    setPlannedTermDate(data.dueDate);
    var myString: string = String(data.isPremature);
    setIsPremature(myString);
    // 
  };
  const [gender, setGender] = React.useState(childData != null ? childData.gender : '');
  useFocusEffect(
    React.useCallback(() => {
      getAllChildren(dispatch);
      getAllConfigData(dispatch);

    }, [])
  );
 const onChildPhotoChange=async (child: ChildEntity | undefined, image: ImageObject)=>{
    // Create Documents/children folder if it doesnt exist
    if (!(await exists(`${DocumentDirectoryPath}/children`))) {
        mkdir(`${DocumentDirectoryPath}/children`);
    }

    // Set newFilename
    let newFilename: string;

    let parts = image.path.split('.');
    let extension: string | null = null;
    if (parts.length > 1) {
        extension = parts[parts.length - 1].toLowerCase();
    };

    let timestamp = new Date().getTime();

    if (child) {
        if (extension) {
            newFilename = `${child.uuid}_${timestamp}.${extension}`;
        } else {
            newFilename = child.uuid + "_" + timestamp;
        };

        // Set destPath
        let destPath = `${DocumentDirectoryPath}/children/${newFilename}`;

        // Delete image if it exists
        if (await exists(destPath)) {
            await unlink(destPath);
        };

        // Copy image
        await copyFile(image.path, destPath);
        setphotoUri(destPath.replace(DocumentDirectoryPath, ''));
        // Save imageUri to realm
        // userRealmCommon.realm?.write(() => {
        //     child.photoUri = destPath.replace(DocumentDirectoryPath, '');
        // });
    };
};

  const handleImageOptionClick = async (index: number) => {
    if(index==0){
      // MediaPicker.cleanupSingleImage((image:any) => {
      //   // image.path ==>> file path 
      //   console.log(image,"..image..")
      // setphotoUri('');
      //});
      deleteImageFile(capturedPhoto).then(async (data:any)=>{
        console.log(data,"..deleted..");
        let record={
          uuid:childData.uuid,
          photoUri:''
        }
        let createresult = await userRealmCommon.updatePhotoUri<ChildEntity>(ChildEntitySchema, record);
        if(createresult=='success'){
          MediaPicker.cleanupImages();
          setCapturedImage('');
        }
        else{
          Alert.alert("Try again...");
        }
       
      }).catch((error:any)=>{
        Alert.alert("Try again..");
      })

    }
    else if(index==1){
      MediaPicker.showCameraImagePicker((image:any) => {
        // image.path ==>> file path 
        console.log(image,"..image..");
        cleanUPImage(image);
        setCapturedImage(image.path);
        onChildPhotoChange(childData,image);
       // setphotoUri(image.path)
      });
    }
    else if(index==2){
      MediaPicker.showGalleryImagePicker((image:any) => {
        // image.path ==>> file path 
        console.log(image,"..image..");
        cleanUPImage(image);
        setCapturedImage(image.path);
        onChildPhotoChange(childData,image);
        //setphotoUri(image.path);
      });
    }
   
  };
  const deleteRecord = (index:number,dispatch:any,uuid: string) => {
    //console.log("..deleted..");
    // deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"');
    return new Promise((resolve, reject) => {
      Alert.alert('Delete Child', "Do you want to delete child?",
        [
          {
            text: "Cancel",
            onPress: () => reject("error"),
            style: "cancel"
          },
          { 
            text: "Delete", onPress: () => {
            deleteChild(index,dispatch,'ChildEntity', uuid,'uuid ="' + uuid+ '"',resolve,reject);
            navigation.navigate('ChildProfileScreen')
          }
          }
        ]
      );
    });
   
  }
  useEffect(() => {
    // async function askPermissions() {
  
    //   if (Platform.OS === 'android') {
    //       await requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]).then((statuses:any) => {
    //         console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
    //         console.log('WriteExternalSToage', statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]);
    //         console.log('ReadExternalSToage', statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]);
    //       });
    //   }

    //   if (Platform.OS === 'ios') {
    //    //   await Permissions.requestMultiple(['ios.permission.CAMERA', 'ios.permission.PHOTO_LIBRARY']);
    //   }
    // }

    // askPermissions();
  }, []);
  const AddChild = async () => {
    let insertData: any = editScreen ? await getNewChild(uuid, plannedTermDate, isPremature, birthDate, '', name, photoUri, gender) : await getNewChild('', plannedTermDate, isPremature, birthDate, '', name, photoUri, gender);
    let childSet: Array<any> = [];
    childSet.push(insertData);
    console.log(insertData,"..insertData..");
    addChild(editScreen, 2, childSet, dispatch, navigation);
  }
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: headerColor }}>
        <FocusAwareStatusBar animated={true} backgroundColor={headerColor} />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: headerColor,
            maxHeight: 50,
          }}>
          <View style={{ flex: 1, padding: 15 }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon name={'ic_back'} color="#FFF" size={15} />
            </Pressable>
          </View>
          <View style={{ flex: 9, padding: 7 }}>
          {
          childData && childData?.uuid!=""?(<Heading2w>{'Edit Child Profile'} </Heading2w>):( <Heading2w>{'Add Brother or Sister'}</Heading2w>)
           
          }
          </View>
          <View style={{ flex: 9, padding: 7,alignItems:'flex-end' }}>
          {
          (childList?.length> 1 && childData && childData?.uuid!="") ? (
            <Heading2w onPress={() => deleteRecord(childData?.index,dispatch,childData?.uuid)}>Delete</Heading2w>
            ) :null
          }
           </View>
        </View>

        <ScrollView style={{ flex: 4 }}>
          <View style={{ flexDirection: 'column' }}>
          {
            (capturedPhoto!='' && capturedPhoto!=null && capturedPhoto!=undefined) ?
           
               <View
                 style={{ marginVertical: 24, alignItems: 'center' }} >
                    <View
                 style={{ marginVertical: 24, alignItems: 'flex-end' }} >
                    <Icon name="ic_camera" size={20} color="#FFF" onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}/>
              </View>
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    style={{ width: 200, height: 200 }}
                    source={capturedPhoto!='' ? {uri:  "file://" +capturedPhoto } : null}
                  />
                
                </View>:
             <Pressable
              style={{
                height: 150,
                backgroundColor: SecondaryColor,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                actionSheetRef.current?.setModalVisible();
              }}>
              <Icon name="ic_camera" size={20} color="#FFF" />
            </Pressable>
              }
            <View style={{ padding: 10 }}>
              <LabelText>Name</LabelText>
              <View style={{ flex: 1 }}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="always"
                  onChangeText={(value) => { setName(value) }}
                  value={name}
                  // onChangeText={queryText => handleSearch(queryText)}
                  placeholder="Enter your child name"
                  style={{
                    backgroundColor: '#FFF',
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                {genders.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{ padding: 10, backgroundColor: '#FFF', margin: 3 }}>
                      <Pressable
                        onPress={() => {
                          //console.log(item,"..item..");
                          setGender(item);
                        }}>
                        <Heading3>{item}</Heading3>
                      </Pressable>
                    </View>
                  );
                })}
              </View>

              <ChildDate sendData={sendData} childData={childData} />

              <View style={{ width: '100%', marginTop: 30 }}>
                <ButtonPrimary onPress={() => {
                  AddChild()

                }}>
                  {
                  childData && childData?.uuid!=""?(
                  <ButtonText>Edit Profile</ButtonText>):(
                  <ButtonText>Add Profile</ButtonText>)
                  }
                </ButtonPrimary>
                 
               
              </View>
            </View>
          </View>
          <ActionSheet ref={actionSheetRef}>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {
              imageOptions.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: 'center',
                      flexDirection: 'row',
                      padding: 16,
                    }}>
                    <Pressable
                      style={{ alignItems: 'center' }}
                      onPress={() => {
                        actionSheetRef.current?.hide();
                        handleImageOptionClick(index);
                      }}>
                      <Icon name={item.iconName} size={50} color="#000" />
                      <Heading4>{item.name}</Heading4>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ActionSheet>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
export default EditChildProfile;
