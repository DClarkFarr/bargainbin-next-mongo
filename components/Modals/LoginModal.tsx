import LoginPanel from "../Forms/LoginPanel";
import BaseModal, { BaseModalProps } from "./BaseModal";

const LoginModal = ({ show, onClose }: BaseModalProps) => {
    return (
        <BaseModal show={show} onClose={onClose}>
            <LoginPanel onSuccess={onClose} redirect={false} />
        </BaseModal>
    );
};

export default LoginModal;
