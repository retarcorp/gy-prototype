import { useParams } from "react-router";
import withUserAuthWrapper from "../withUserAuthWrapper";
import withUserWrapper from "../withUserWrapper";
import EventResultsPageView from "./EventResultsPageView"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchEventResults } from "../../../store/userEvents";

const EventResultsPage = () => {
    const eventId = parseInt(useParams().id as string);
    const dispatch = useDispatch();
    const results = useSelector((state: any) => state.userEvents.gameFullResults);
    
    console.log(results);

    useEffect(() => {
        dispatch<any>(fetchEventResults(eventId))
    }, [])
    

    return <> {results ? <EventResultsPageView event={results.event}/> : 'Loading results...' } </>
}

export default withUserAuthWrapper(withUserWrapper(EventResultsPage));