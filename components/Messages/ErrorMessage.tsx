import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ErrorMessage = ({ text }: { text: string }) => {
    if (!text) {
        return <></>;
    }
    return (
        <div className="error text-red-800 px-3 py-3">
            <FontAwesomeIcon icon={faExclamationCircle} className="pr-3" />
            {text}
        </div>
    );
};

export default ErrorMessage;
