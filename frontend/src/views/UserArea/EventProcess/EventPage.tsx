import React from "react";
import withUserWrapper from "../withUserWrapper";

function EventPage() {
    return (
        <div>
            <h1>Event Page</h1>
        </div>
    );
}

export default withUserWrapper(EventPage);