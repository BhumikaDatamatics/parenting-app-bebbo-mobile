import { HealthCheckUpsEntity, HealthCheckUpsSchema } from './../../../database/schema/HealthCheckUpsSchema';
import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../../../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema } from "../../../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../../../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../../../database/schema/ChildDevelopmentSchema";
import { DailyHomeMessagesSchema, DailyHomeMessagesEntity } from "../../../database/schema/DailyHomeMessagesSchema";
import { MilestonesEntity, MilestonesSchema } from "../../../database/schema/MilestonesSchema";
import { PinnedChildDevelopmentEntity, PinnedChildDevelopmentSchema } from "../../../database/schema/PinnedChildDevelopmentSchema";
import { StandardDevHeightForAgeEntity, StandardDevHeightForAgeSchema } from "../../../database/schema/StandardDevHeightForAgeSchema";
import { StandardDevWeightForHeightEntity, StandardDevWeightForHeightSchema } from "../../../database/schema/StandardDevWeightForHeightSchema";
import { TaxonomyEntity, TaxonomySchema } from "../../../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../../../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../../../database/schema/VideoArticleSchema";
import { setAllArticleData } from "../../../redux/reducers/articlesSlice";
import { setAllHealthCheckupsData, setAllActivitiesData, setAllChildDevData, setAllMileStonesData, setAllPinnedChildDevData, setAllTaxonomyData, setAllTermsData, setAllVaccineData, setAllVideoArticlesData, setDailyMessagesData, setStandardDevHFAData, setStandardDevWFHData } from "../../../redux/reducers/utilsSlice";
import { ActivitiesData } from "./ActivitiesData";
import { appConfig } from "./apiConstants";
import { articledata } from "./article";
import basicPagesData from "./basicPages";
import { ChildDevelopmentData } from "./ChildDevelopmentData";
import { dailyHomeNotificationdata } from "./dailyHomeNotification";
import { MileStonesData } from "./MileStonesData";
import { PinnedChildDevData } from "./PinnedChildDevData";
import standardDevData from "./standardDevData";
import { taxonomydata } from "./taxonomies";
import {vaccineData} from "./vaccineData";
import { healthCheckupsData } from './healthCheckupsData';
import { VideoArticleData } from "./VideoArticleData";

// const getAllDataToStore = async (languageCode:string,dispatch:any,apiEndpoint:string) => {
const getAllDataToStore = async (languageCode:string,dispatch:any,prevPage:string,activeChild?:any) => {
    return new Promise(async (resolve, reject) => {
        // if(apiEndpoint == appConfig.basicPages || apiEndpoint == appConfig.activities || apiEndpoint == appConfig.milestones)
        // console.log("getAllDataToStore--");
        if(prevPage == "CountryLanguageSelection")
        {
            // try {
                let Entity:any;
                const basicData = await getDataToStore(languageCode,dispatch,BasicPagesSchema,Entity as BasicPagesEntity,basicPagesData,setAllTermsData);
                const taxonomyData = await getDataToStore(languageCode,dispatch,TaxonomySchema,Entity as TaxonomyEntity,taxonomydata,setAllTaxonomyData);
                //taxonomy
                //sponsor
                // console.log("success");
                resolve("success");
            // } catch (e) {
            //     reject();
            // }
        } else if(prevPage == "Terms"){
            let Entity:any;
            const alldailyNotiData = await getDataToStore(languageCode,dispatch,DailyHomeMessagesSchema,Entity as DailyHomeMessagesEntity,dailyHomeNotificationdata,setDailyMessagesData,'id');
            const allstanDevWFHData = await getDataToStore(languageCode,dispatch,StandardDevWeightForHeightSchema,Entity as StandardDevWeightForHeightEntity,standardDevData,setStandardDevWFHData);
            const allstanDevHFAData = await getDataToStore(languageCode,dispatch,StandardDevHeightForAgeSchema,Entity as StandardDevHeightForAgeEntity,standardDevData,setStandardDevHFAData);
            const allVaccinesData = await getDataToStore(languageCode,dispatch,VaccinationSchema,Entity as VaccinationEntity,vaccineData,setAllVaccineData);
            const allHealthCheckupsData = await getDataToStore(languageCode,dispatch,HealthCheckUpsSchema,Entity as HealthCheckUpsEntity,healthCheckupsData,setAllHealthCheckupsData);
            const allChildDevlopmentData = await getDataToStore(languageCode,dispatch,ChildDevelopmentSchema,Entity as ChildDevelopmentEntity,ChildDevelopmentData,setAllChildDevData);
            const allPinnedChildDevlopmentData = await getDataToStore(languageCode,dispatch,PinnedChildDevelopmentSchema,Entity as PinnedChildDevelopmentEntity,PinnedChildDevData,setAllPinnedChildDevData);
            const allMileStonesData = await getDataToStore(languageCode,dispatch,MilestonesSchema,Entity as MilestonesEntity,MileStonesData,setAllMileStonesData);
            const allVideoArticlesData = await getDataToStore(languageCode,dispatch,VideoArticleEntitySchema,Entity as VideoArticleEntity,VideoArticleData,setAllVideoArticlesData);
            const allActivitiesData = await getDataToStore(languageCode,dispatch,ActivitiesEntitySchema,Entity as ActivitiesEntity,ActivitiesData,setAllActivitiesData);

            resolve("nocall");
        } else if(prevPage == "ChilSetup"){
            let Entity:any;
            const currentChildData = {
                "gender":activeChild.gender,
                "parent_gender":activeChild.parent_gender,
                "taxonomyData":activeChild.taxonomyData
              }
            const artData = await getDataToStore(languageCode,dispatch,ArticleEntitySchema,Entity as ArticleEntity,articledata,setAllArticleData,"",currentChildData);
            resolve("nocall");
        }
    });


}
const getDataToStore = async (languageCode:string,dispatch:any,SchemaToUse:ObjectSchema,SchemaEntity:any,jsonData:any,setAllHardcodedData:Function,sortBy?:any,currentChildData?:any) => {
    return new Promise(async (resolve, reject) => {
        // console.log("getDataToStore--",SchemaToUse);
        let databaselistener:any;
        let dataToStore:any;
        let offlineData:any;
        if(SchemaToUse.name == StandardDevWeightForHeightSchema.name)
        {
            offlineData = jsonData[languageCode][0].weight_for_height;
            // console.log(offlineData);
        }
        else if(SchemaToUse.name == StandardDevHeightForAgeSchema.name)
        {
            offlineData = jsonData[languageCode][0].height_for_age;
            // console.log(offlineData);
        }
        else {
            offlineData = jsonData[languageCode];
            // console.log(offlineData);
        }
        let databaseData2 = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse,sortBy);
        if(SchemaToUse.name == ArticleEntitySchema.name)
        {
            if(currentChildData && currentChildData != "")
            {
                const filterQuery = '(child_age == '+currentChildData.taxonomyData.id+' || child_age == 0)';
                console.log(filterQuery,"..filterQuery..");
                let databaseData = await dataRealmCommon.getFilteredData<typeof SchemaEntity>(SchemaToUse,filterQuery);
                console.log(databaseData.length);
                dataToStore = databaseData;
            }else {
                dataToStore = databaseData2;
            }
        }
        else {
            dataToStore = databaseData2;
        }
            databaseData2.removeAllListeners();
            databaselistener = databaseData2.addListener(() => {
                // console.log("listener called");
                if(dataToStore?.length > 0)
                {
                    // console.log("in if  getDataToStore");
                    dispatch(setAllHardcodedData(dataToStore));
                    resolve(dataToStore);
                }else {
                    // console.log("in else  getDataToStore");
                    dispatch(setAllHardcodedData(JSON.stringify(offlineData)));
                    resolve(offlineData);
                }
            });
    });
}

  
export default getAllDataToStore;