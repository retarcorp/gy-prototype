import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "../../store/user";


export default function withUserAuthWrapper(Component) {
    return function UserAuthWrapper(props) {

        const token = useSelector(state => state.user.token);
        const currentUser = useSelector(state => state.user.user);
        const isLoading = useSelector(state => state.user.isLoading);
        const isTokenChecked = useSelector(state => state.user.isTokenChecked);

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(validateToken());
        }, [dispatch])

        if (isTokenChecked) {
            if (!currentUser) {
                window.location.href = '/';
                return <></>
            }
        }

        return <>
            <Component {...props} />
        </>
    }
}

export const TestComponent = withUserAuthWrapper(() => <>Test Component</>);