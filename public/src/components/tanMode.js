import {shallowEqual, useSelector} from "react-redux";

const result = useSelector(state=>state, shallowEqual)

export default function TanMode() {
    return (
        <div>
            {/*{result}*/}
        </div>
    )
}
