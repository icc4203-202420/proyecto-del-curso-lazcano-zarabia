import React, { useState, useEffect, useReducer } from 'react';

const DataFetcher = ({ endpoint, onDataFetched }) => {

    const [data, dispatchData] = useReducer(
        dataReducer,
        { data: [], isLoading: false, isError: false }
    );

    useEffect(()=> {
        
    })

};

export default DataFetcher;
