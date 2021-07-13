import React, { useState, useEffect, useRef, useMemo } from "react";
import { FlatList, View, Text, ActivityIndicator } from "react-native";

const InfiniteScrollList = (props : any) => {
    const { filteredData , renderArticleItem } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const limit = 10;
    const totalDataCount = filteredData.length;
    const [page, setPage] = useState(1);
    const [clientData, setClientData] = useState([]);
    const [serverData, serverDataLoaded] = useState([]);
    const [loadmore, setLoadmore] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [pending_process, setPending_process] = useState(true);
    let onEndReachedCalledDuringMomentum = true;
    const flatListRef = useRef(null);
    // const memoizedValue = useMemo(() => renderArticleItem, [clientData]);
    useEffect(() => {
        console.log("filteredData changed---",filteredData);
        // onRefresh();
        setClientData([]);
        if(page > 1)
        {
            setPage(1);
        }else {
            requestData(page);
        }
    },[filteredData])

    const requestData = (thePage: number) => {
        if(totalDataCount > 0)
        {
            console.log(filteredData,"--filteredData");
            setIsLoading(true);
            let data = filteredData.slice((thePage - 1) * limit, thePage * limit);
            console.log('requestData', data);
            serverDataLoaded(data);
        }
    }
    useEffect(() => {
        // console.log(page,'requestData on load',totalDataCount);
        
        // if(totalDataCount > 0)
        // {
            requestData(page);
        // }
    }, []);

    useEffect(() => {
        // console.log('obtained serverData', serverData);
        // if(serverData.length > 0)
        // {
            setRefresh(false);
            setClientData([...clientData, ...serverData]);
            
            // setLoadmore(filteredData.length > clientData.length ? true : false);
        //     setPending_process(false);
        // }else {
        //     setLoadmore(false);
        // }
    }, [serverData]);
    useEffect(() => {
        console.log("clientData--",clientData);
        setIsLoading(false)
        // if(filteredData.length > clientData.length)
        // {
        //     setLoadmore(true);
        // }else {
        //     setLoadmore(false);
        // }
    },[clientData]);
    useEffect(() => {
        console.log('load more with page', page);
        // if(serverData.length === limit || page == 1)
        // {
            // setPending_process(true);
        // if(totalDataCount > 0)
        // {
            requestData(page);
        // }
        // }
    }, [page]);

    const handleLoadMore = () => {
        if(!onEndReachedCalledDuringMomentum)
        {
            console.log('clientData.length', clientData.length);
            // console.log('totalDataCount', totalDataCount);
            // if (loadmore && !pending_process) {
            if (clientData.length < totalDataCount) {
                setPage(page + 1);
                // requestData(page);
            }
            onEndReachedCalledDuringMomentum = true;
        }
    };

    const onRefresh = () => {
            setRefresh(true);
            if(page != 1)
            {
                setClientData([]);
                setPage(1);
            }else {
                setRefresh(false);
            }
        // requestData(page);
        // setPending_process(false);
    };
    const renderRow = ({item , index}:any) => {
            return (
                <View key={index} style={{height:100}}>
                    <Text style={{color: 'red'}}>{item.title} {index}</Text>
                </View>
            );
        };
    const renderFooter = () => {
        console.log(isLoading,"---isLoading");
        return(
            isLoading ? <ActivityIndicator size="large" /> : null
        )
    };  
    return (
        <View style={{marginBottom:200}}>
            <FlatList
            ref={flatListRef}
            extraData={page}
            // refreshing={refresh}
            data={clientData}
            // data={filteredData}
            initialNumToRender={limit}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            // getItemLayout={(data, index) => (
            //     {length: 40, offset: 40 * index, index}
            // )}
            onRefresh={() => onRefresh()}
            // onRefresh={this.handleRefresh}
            refreshing={refresh}
            // onEndReachedThreshold={2}
            // onEndReached={this.handleLoadMore}
            // renderItem={({item, index}) => <Text>{item.title} {index}</Text>}
            // renderItem={({item, index}) => renderArticleItem(item, index)}
            renderItem={renderArticleItem}
            // renderItem={memoizedValue}
            // showsHorizontalScrollIndicator={false}
            // showsVerticalScrollIndicator={true}
            // keyExtractor={(item, index) => {
            //   return index.toString();
            // }}
            keyExtractor={(item) => item.id.toString()}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum = false;
            }}
            // ListHeaderComponent={ContentThatGoesAboveTheFlatList}
            ListFooterComponent={renderFooter}
            /> 
        </View>
    )
}

export default InfiniteScrollList