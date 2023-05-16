import { useSelector } from "react-redux";
import withUserWrapper from "./withUserWrapper";
import withUserAuthWrapper from "./withUserAuthWrapper";

function UserArea() {
    const user = useSelector(state => state.user.user);
    console.log(user);

    if (user.onboardingCompleted) {
        window.location.href = '/user/events';
    } else {
        window.location.href = '/user/onboarding';
    }
    return <> </>
}

export default withUserAuthWrapper(withUserWrapper(UserArea));