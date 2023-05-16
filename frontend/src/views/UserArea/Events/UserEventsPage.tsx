import React, { useEffect } from 'react';
import withUserWrapper from '../withUserWrapper';
import EventsPageView from './EventsPageView';
import withUserAuthWrapper from '../withUserAuthWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllEvents, loadUserEvents, registerOnEvent, unregisterFromEvent } from '../../../store/userEvents';

function UserEventsPage() {

  const dispatch = useDispatch();
  const mapDate = (e: any) => ({ ...e, dateTime: new Date(e.datetime)})
  const availableEvents = useSelector((state: any & {userEvents: any[]}) => state.userEvents.availableEvents).map(mapDate);
  const upcomingEvents = useSelector((state: any & {userEvents: any[]}) => state.userEvents.upcomingEvents).map(mapDate);
  const pastEvents = useSelector((state: any & {userEvents: any[]}) => state.userEvents.participatedEvents).map(mapDate);

  useEffect(() => {
    dispatch<any>(loadAllEvents())
  }, [])

  const register = (e) => {
    dispatch<any>(registerOnEvent(e));
  }

  const cancel = (e) => {
    dispatch<any>(unregisterFromEvent(e));
  }

  return <EventsPageView 
    available={availableEvents}
    upcoming={upcomingEvents}
    past={pastEvents}
    onRegister={(e: any) => register(e)}
    onCancel={(e: any) => cancel(e)}
  />;
}

export default withUserAuthWrapper(withUserWrapper(UserEventsPage));