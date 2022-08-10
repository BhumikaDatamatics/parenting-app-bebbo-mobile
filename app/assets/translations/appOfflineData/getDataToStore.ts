import { ObjectSchema } from "realm";
import { dataRealmCommon } from "../../../database/dbquery/dataRealmCommon";
import { ActivitiesEntity, ActivitiesEntitySchema } from "../../../database/schema/ActivitiesSchema";
import { ArticleEntity, ArticleEntitySchema } from "../../../database/schema/ArticleSchema";
import { BasicPagesEntity, BasicPagesSchema } from "../../../database/schema/BasicPagesSchema";
import { ChildDevelopmentEntity, ChildDevelopmentSchema } from "../../../database/schema/ChildDevelopmentSchema";
import { DailyHomeMessagesEntity, DailyHomeMessagesSchema } from "../../../database/schema/DailyHomeMessagesSchema";
import { FAQsEntity, FAQsSchema } from "../../../database/schema/FAQsSchema";
import { MilestonesEntity, MilestonesSchema } from "../../../database/schema/MilestonesSchema";
import { PinnedChildDevelopmentEntity, PinnedChildDevelopmentSchema } from "../../../database/schema/PinnedChildDevelopmentSchema";
import { StandardDevHeightForAgeEntity, StandardDevHeightForAgeSchema } from "../../../database/schema/StandardDevHeightForAgeSchema";
import { StandardDevWeightForHeightEntity, StandardDevWeightForHeightSchema } from "../../../database/schema/StandardDevWeightForHeightSchema";
import { SurveysSchema } from '../../../database/schema/SurveysSchema';
import { TaxonomyEntity, TaxonomySchema } from "../../../database/schema/TaxonomySchema";
import { VaccinationEntity, VaccinationSchema } from "../../../database/schema/VaccinationSchema";
import { VideoArticleEntity, VideoArticleEntitySchema } from "../../../database/schema/VideoArticleSchema";
import { setAllArticleData } from "../../../redux/reducers/articlesSlice";
import { setAllActivitiesData, setAllChildDevData, setAllFaqsData, setAllHealthCheckupsData, setAllMileStonesData, setAllPinnedChildDevData, setAllSurveyData, setAllTaxonomyData, setAllTermsData, setAllVaccineData, setAllVideoArticlesData, setDailyMessagesData, setStandardDevHFAData, setStandardDevWFHData } from "../../../redux/reducers/utilsSlice";
import { HealthCheckUpsEntity, HealthCheckUpsSchema } from './../../../database/schema/HealthCheckUpsSchema';
import { SurveysEntity } from './../../../database/schema/SurveysSchema';
import { appConfig, both_child_gender, both_parent_gender} from "./apiConstants";
import { basicPagesData, taxonomydata, articledata, dailyHomeNotificationdata, standardDevData, vaccineData, healthCheckupsData, ChildDevelopmentData, PinnedChildDevData, MileStonesData, VideoArticleData, ActivitiesData, SurveyData, FaqsData } from '@dynamicImportsClass/dynamicImports';

export const getDataToStore = async (languageCode: string, dispatch: any, SchemaToUse: ObjectSchema, SchemaEntity: any, jsonData: any, setAllHardcodedData: Function, sortBy?: any, currentChildData?: any, queryText?: any) => {
    return new Promise(async (resolve) => {
        let dataToStore: any;
        let offlineData: any;
        if (SchemaToUse.name == StandardDevWeightForHeightSchema.name) {
            offlineData = jsonData[languageCode] ? jsonData[languageCode][0].weight_for_height : undefined;
             if (offlineData == undefined || offlineData == "" || offlineData == {}) {
                offlineData = [];
            }
        }
        else if (SchemaToUse.name == StandardDevHeightForAgeSchema.name) {
            offlineData = jsonData[languageCode] ? jsonData[languageCode][0].height_for_age : undefined;
            if (offlineData == undefined || offlineData == "" || offlineData == {}) {
                offlineData = [];
            }
        }
        else {
            offlineData = jsonData[languageCode];
            if (offlineData == undefined || offlineData == "" || offlineData == {}) {
                offlineData = [];
            }
        }
        const databaseData2 = await dataRealmCommon.getData<typeof SchemaEntity>(SchemaToUse, sortBy);
        if (SchemaToUse.name == ArticleEntitySchema.name) {
            if (currentChildData && currentChildData != "") {
                let filterQuery = '';
                if (currentChildData.taxonomyData && currentChildData.taxonomyData.id) {
                    filterQuery += '(child_age == ' + currentChildData.taxonomyData.id + ' || ';
                }
                if (filterQuery != '') {
                    filterQuery += 'child_age == 0)';

                }
                else {
                    filterQuery += 'child_age == 0';
                }
                if (currentChildData.parent_gender != "" && currentChildData.parent_gender != 0 && currentChildData.parent_gender != "0") {
                    filterQuery += '&& (parent_gender==' + parseInt(currentChildData.parent_gender) + ' || parent_gender == ' + both_parent_gender + ' || parent_gender == ' + String(both_parent_gender) + '  || parent_gender == 0)';
                }
                if (currentChildData.gender != "" && currentChildData.gender != 0 && currentChildData.gender != "0") {
                    filterQuery += '&& (child_gender==' + parseInt(currentChildData.gender) + ' || child_gender == ' + both_child_gender + ' || child_gender == ' + String(both_child_gender) + '  || child_gender == 0)';
                }
               // title CONTAINS 'Pe' && summary CONTAINS 'Ac' && body CONTAINS 'About'
                const databaseData = await dataRealmCommon.getFilteredData<typeof SchemaEntity>(SchemaToUse, filterQuery);
                dataToStore = databaseData;
            } else {
                dataToStore = databaseData2;
            }
        }
        else {
            dataToStore = databaseData2;
        }
        if (dataToStore?.length > 0) {
            dispatch(setAllHardcodedData(dataToStore));
            resolve(dataToStore);
        } else {
            dispatch(setAllHardcodedData(JSON.stringify(offlineData)));
            resolve(offlineData);
        }
    });
}
const getAllDataToStore = async (languageCode: string, dispatch: any, prevPage: string, activeChild?: any) => {
    return new Promise(async (resolve) => {
        if (prevPage == "CountryLanguageSelection") {
            // try {
            let Entity: any;
            await getDataToStore(languageCode, dispatch, BasicPagesSchema, Entity as BasicPagesEntity, basicPagesData, setAllTermsData);
            await getDataToStore(languageCode, dispatch, TaxonomySchema, Entity as TaxonomyEntity, taxonomydata, setAllTaxonomyData);
            resolve("success");
        }
        else if (prevPage == "AddEditChild") {
            let Entity: any;
            const currentChildData = {
                "gender": activeChild.gender,
                "parent_gender": activeChild.parent_gender,
                "taxonomyData": activeChild.taxonomyData
            }
            await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
            resolve("nocall");
        }
        else if (prevPage == "Terms") {
            let Entity: any;
            await getDataToStore(languageCode, dispatch, DailyHomeMessagesSchema, Entity as DailyHomeMessagesEntity, dailyHomeNotificationdata, setDailyMessagesData, 'id');
            await getDataToStore(languageCode, dispatch, StandardDevWeightForHeightSchema, Entity as StandardDevWeightForHeightEntity, standardDevData, setStandardDevWFHData);
            await getDataToStore(languageCode, dispatch, StandardDevHeightForAgeSchema, Entity as StandardDevHeightForAgeEntity, standardDevData, setStandardDevHFAData);
            await getDataToStore(languageCode, dispatch, VaccinationSchema, Entity as VaccinationEntity, vaccineData, setAllVaccineData);
            await getDataToStore(languageCode, dispatch, HealthCheckUpsSchema, Entity as HealthCheckUpsEntity, healthCheckupsData, setAllHealthCheckupsData);
            await getDataToStore(languageCode, dispatch, ChildDevelopmentSchema, Entity as ChildDevelopmentEntity, ChildDevelopmentData, setAllChildDevData);
            await getDataToStore(languageCode, dispatch, PinnedChildDevelopmentSchema, Entity as PinnedChildDevelopmentEntity, PinnedChildDevData, setAllPinnedChildDevData);
            await getDataToStore(languageCode, dispatch, MilestonesSchema, Entity as MilestonesEntity, MileStonesData, setAllMileStonesData);
            await getDataToStore(languageCode, dispatch, VideoArticleEntitySchema, Entity as VideoArticleEntity, VideoArticleData, setAllVideoArticlesData);
            await getDataToStore(languageCode, dispatch, ActivitiesEntitySchema, Entity as ActivitiesEntity, ActivitiesData, setAllActivitiesData);
            await getDataToStore(languageCode, dispatch, SurveysSchema, Entity as SurveysEntity, SurveyData, setAllSurveyData);
            await getDataToStore(languageCode, dispatch, FAQsSchema, Entity as FAQsEntity, FaqsData, setAllFaqsData);
            resolve("nocall");
        } else if (prevPage == "ChilSetup") {
            let Entity: any;
            const currentChildData = {
                "gender": activeChild.gender,
                "parent_gender": activeChild.parent_gender,
                "taxonomyData": activeChild.taxonomyData
            }
            await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
            resolve("nocall");
        } else {
            resolve("fail");
        }
    });


}

export const getAllDataOnRetryToStore = async (apiEndpoint: string, languageCode: string, dispatch: any, prevPage: string, activeChild?: any) => {
    return new Promise(async (resolve) => {
        let Entity: any;
        if (apiEndpoint == appConfig.basicPages) {
            await getDataToStore(languageCode, dispatch, BasicPagesSchema, Entity as BasicPagesEntity, basicPagesData, setAllTermsData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.taxonomies) {
            await getDataToStore(languageCode, dispatch, TaxonomySchema, Entity as TaxonomyEntity, taxonomydata, setAllTaxonomyData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.dailyMessages) {
            await getDataToStore(languageCode, dispatch, DailyHomeMessagesSchema, Entity as DailyHomeMessagesEntity, dailyHomeNotificationdata, setDailyMessagesData, 'id');
            resolve("success");
        }
        else if (apiEndpoint == appConfig.standardDeviation) {
            await getDataToStore(languageCode, dispatch, StandardDevWeightForHeightSchema, Entity as StandardDevWeightForHeightEntity, standardDevData, setStandardDevWFHData);
            await getDataToStore(languageCode, dispatch, StandardDevHeightForAgeSchema, Entity as StandardDevHeightForAgeEntity, standardDevData, setStandardDevHFAData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.vaccinations) {
            await getDataToStore(languageCode, dispatch, VaccinationSchema, Entity as VaccinationEntity, vaccineData, setAllVaccineData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.healthCheckupData) {
            await getDataToStore(languageCode, dispatch, HealthCheckUpsSchema, Entity as HealthCheckUpsEntity, healthCheckupsData, setAllHealthCheckupsData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.childDevelopmentData) {
            await getDataToStore(languageCode, dispatch, ChildDevelopmentSchema, Entity as ChildDevelopmentEntity, ChildDevelopmentData, setAllChildDevData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.childdevBoyPinnedContent || apiEndpoint == appConfig.childdevGirlPinnedContent) {
            await getDataToStore(languageCode, dispatch, PinnedChildDevelopmentSchema, Entity as PinnedChildDevelopmentEntity, PinnedChildDevData, setAllPinnedChildDevData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.milestones) {
            await getDataToStore(languageCode, dispatch, MilestonesSchema, Entity as MilestonesEntity, MileStonesData, setAllMileStonesData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.videoArticles) {
            await getDataToStore(languageCode, dispatch, VideoArticleEntitySchema, Entity as VideoArticleEntity, VideoArticleData, setAllVideoArticlesData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.activities) {
            await getDataToStore(languageCode, dispatch, ActivitiesEntitySchema, Entity as ActivitiesEntity, ActivitiesData, setAllActivitiesData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.surveys) {
            await getDataToStore(languageCode, dispatch, SurveysSchema, Entity as SurveysEntity, SurveyData, setAllSurveyData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.faqs) {
            await getDataToStore(languageCode, dispatch, FAQsSchema, Entity as FAQsEntity, FaqsData, setAllFaqsData);
            resolve("success");
        }
        else if (apiEndpoint == appConfig.articles) {
            const currentChildData = {
                "gender": activeChild.gender,
                "parent_gender": activeChild.parent_gender,
                "taxonomyData": activeChild.taxonomyData
            }
            await getDataToStore(languageCode, dispatch, ArticleEntitySchema, Entity as ArticleEntity, articledata, setAllArticleData, "", currentChildData);
            resolve("success");
        } else {
            resolve("fail");
        }
    });
}

export default getAllDataToStore;