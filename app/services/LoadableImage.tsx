import { destinationFolder } from '@assets/translations/appOfflineData/apiConstants';
import React, { Component, Suspense, useEffect, useState } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Text } from 'react-native';
import downloadImages from '../downloadImages/ImageStorage';
import RNFS from 'react-native-fs';
import { useFocusEffect } from '@react-navigation/native';
import { DefaultImage } from '@components/shared/Image';
import FastImage from 'react-native-fast-image';
import { useAppSelector } from '../../App';
import { useNetInfo } from '@react-native-community/netinfo';
import { removeParams } from './Utils';
const LoadableImage = (props:any) => {
  const [imageState, setImageState] = useState('loading');
  const netInfo = useNetInfo();
  const [noImage, setNoImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<any>();
  const toggleSwitchVal = useAppSelector((state: any) =>
    state.bandWidthData?.lowbandWidth
      ? state.bandWidthData.lowbandWidth
      : false,
  );
    const { style,item } = props;
   
    // console.log(item.id, "..id..")
    const downloadImage = async (item:any) => {
      // console.log(item['cover_image'],"..item..");
      // console.log(toggleSwitchVal,"..download iamgetoggleSwitchVal..")
      // if(toggleSwitchVal==true){
      //   setNoImage(true);
      // }
      // else{
      if (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) {
        // console.log(item,"..11item..");
        let imageName=removeParams(item['cover_image']?.url.split('/').pop());
        console.log(imageName,"..imageName..");
        if (await RNFS.exists(RNFS.DocumentDirectoryPath + '/content' + '/' + imageName)) {
          // console.log("..22item..");
          setImageState('loaded');
          setImageUrl(encodeURI("file://" + destinationFolder + removeParams(item['cover_image']?.url.split('/').pop())))
        }
        else {
          // console.log(item,"..33item..");
          if(toggleSwitchVal==true){
            if (await RNFS.exists(RNFS.DocumentDirectoryPath + '/content' + '/' + imageName)) {
              // console.log("..22item..");
              setNoImage(false);
              setImageState('loaded');
              setImageUrl(encodeURI("file://" + destinationFolder + removeParams(item['cover_image']?.url.split('/').pop())))
            }
            else{
              setNoImage(true);
              setImageState('loaded'); // This worked for me
            }
          }
          else{
          setImageState('loading');
          let imageArray: any = [];
          imageArray.push({
            srcUrl: item['cover_image'].url,
            destFolder: RNFS.DocumentDirectoryPath + '/content',
            destFilename: imageName
          })
          // console.log(imageArray, "..imageArray..");
          // if(toggleSwitchVal==false){
          const imagesDownloadResult = await downloadImages(imageArray);
          console.log(imagesDownloadResult,"..imagesDownloadResult..")
          if(imagesDownloadResult && imagesDownloadResult.length>0 && imagesDownloadResult[0].success==true){
              setNoImage(false);
              setImageState('loaded');
              setImageUrl(encodeURI("file://" + destinationFolder + removeParams(item['cover_image']?.url.split('/').pop())))
            }
          // console.log(imagesDownloadResult, "..imagesDownloadResult..");
          }
          // }
          // else{
          //   console.log("..Data Saver on..");
          // }
        }
      }
      //}
    }
    useFocusEffect(
      React.useCallback(() => {
        async function fetchData() {
          // console.log("..11111.......",item.id)
          // setImageState('loading');
          if(netInfo.isConnected){
          downloadImage(item)
          }
          else{
            if (item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined) {
              // console.log(item,"..11item..");
              let imageName=removeParams(item['cover_image']?.url.split('/').pop());      
            if (await RNFS.exists(RNFS.DocumentDirectoryPath + '/content' + '/' + imageName)) {
              // console.log("..22item..");
              setNoImage(false);
              setImageState('loaded');
              setImageUrl(encodeURI("file://" + destinationFolder + removeParams(item['cover_image']?.url.split('/').pop())))
            }
            else{
              setNoImage(true);
              setImageState('loaded'); // This worked for me
            }
          } 
          else{
            setNoImage(true);
            setImageState('loaded'); // This worked for me
          }
          }
        }
        fetchData()
        
      },[netInfo.isConnected])
    );
    useEffect(() => {
     return () => {
        setImageState('loaded'); // This worked for me
        setNoImage(false);
      };
  }, []);
    
    return (
      <>
        <View style={styles.container}>
        {
        (item && item['cover_image'] != "" && item['cover_image'] != null && item['cover_image'] != undefined && item['cover_image'].url != "" && item['cover_image'].url != null && item['cover_image'].url != undefined)?
        
      (
        imageState=='loading'?
        <ActivityIndicator style={style} size="large" color="#000"/>
        :imageUrl?<FastImage  
         onError={() => { setNoImage(true) }}
         style={style} source={{uri:encodeURI("file://" + destinationFolder + removeParams(item['cover_image']?.url.split('/').pop())),priority: FastImage.priority.normal}} 
         resizeMode={FastImage.resizeMode.cover}/>:
         <DefaultImage
         style={style}
         source={require('@assets/trash/defaultArticleImage.png')}/> 
         )
        :
        <DefaultImage
        style={style}
        source={require('@assets/trash/defaultArticleImage.png')}/>   
        } 
        </View>        
      </>
    );
}
export default React.memo(LoadableImage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }
});
