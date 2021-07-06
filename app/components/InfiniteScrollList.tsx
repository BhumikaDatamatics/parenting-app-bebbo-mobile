import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { ArticleListContainer } from "./shared/ArticlesStyle";

const InfiniteScrollList = (props : any) => {
    const { filteredData , renderArticleItem } = props;
    const flatListRef = useRef(null);
    const [limit] = useState(5);
    const [page, setPage] = useState(1);
    const [clientData, setClientData] = useState([]);
    const [serverData, serverDataLoaded] = useState([]);
    const [pending_process, setPending_process] = useState(true);
    const [loadmore, setLoadmore] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const requestData = (thePage: number) => {
        let data = filteredData.slice((thePage - 1) * limit, thePage * limit);
        console.log('requestData', data);
        serverDataLoaded(data);
    }

    useEffect(() => {
        console.log('requestData');
        requestData(page);
    }, []);

    useEffect(() => {
        console.log('obtained serverData', serverData);
        if(serverData.length > 0)
        {
            setRefresh(false);
            setClientData([...clientData, ...serverData]);
            setLoadmore(filteredData.length > clientData.length ? true : false);
            setPending_process(false);
        }else {
            setLoadmore(false);
        }
    }, [serverData]);

    useEffect(() => {
        console.log('load more with page', page);
        if(serverData.length === limit || page == 1)
        {
            setPending_process(true);
            requestData(page);
        }
    }, [page]);

    const handleLoadMore = () => {
        console.log('loadmore', loadmore);
        console.log('pending_process', pending_process);
        if (loadmore && !pending_process) {
            setPage(page + 1);
        }
    };

    const onRefresh = () => {
        setClientData([]);
        setPage(1);
        setRefresh(true);
        setPending_process(false);
        };
        console.log(clientData);
        // const renderRow = ({item , index}:any) => {
        // return (
        //     <ArticleListContainer key={index}>
        //         <Text style={{color: 'red'}}>{item.title}</Text>
        //     </ArticleListContainer>
        // );
    // };
    return (
        // <View style={{ flex: 1 }}>
                <FlatList
                ref={flatListRef}
                refreshing={refresh}
                data={clientData}
                renderItem={renderArticleItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                onRefresh={() => onRefresh()}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
                />
        //  </View>
    );
}

export default InfiniteScrollList