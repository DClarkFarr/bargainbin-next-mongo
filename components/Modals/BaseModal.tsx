import { faTimes } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useModalState from "../../hooks/useModalState";
import { FC } from "../../types/component";

type Handle = ReturnType<typeof setTimeout>;
export type BaseModalProps = {
    show: boolean;
    onClose: () => void;
    clickBg?: boolean;
    size?: "sm" | "md" | "lg";
};

const ModalPortal = ({ children }: FC) => {
    const { modalsTarget } = useModalState();
    return modalsTarget ? (
        createPortal(children, modalsTarget as HTMLDivElement)
    ) : (
        <div className="hidden modals-pending">loading modals</div>
    );
};

const BaseModal = ({
    show,
    onClose,
    clickBg = true,
    size = "sm",
    children,
}: BaseModalProps & FC) => {
    const [uuid, setUuid] = useState("temp");
    const [zIndex, setZIndex] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [open, setOpen] = useState(false);

    const { registerModal, unregisterModal, hideModal, showModal, baseZIndex } =
        useModalState();

    const fullZIndex = useMemo(() => {
        return baseZIndex + zIndex;
    }, [baseZIndex, zIndex]);

    useEffect(() => {
        setUuid(registerModal());

        return () => {
            unregisterModal(uuid);
        };
    }, []);

    const animateHandle = useRef<Handle | null>(null);
    const openHandle = useRef<Handle | null>(null);

    const toggleAnimate = useCallback((toShow: boolean) => {
        window.clearTimeout(animateHandle.current as Handle);

        animateHandle.current = setTimeout(
            () => {
                setAnimate(toShow);
            },
            toShow ? 50 : 100
        );
    }, []);

    const toggleOpen = useCallback((toShow: boolean) => {
        window.clearTimeout(openHandle.current as Handle);

        openHandle.current = setTimeout(
            () => {
                setOpen(toShow);
            },
            toShow ? 100 : 50
        );
    }, []);

    useEffect(() => {
        if (show) {
            setZIndex(showModal(uuid));
        } else {
            hideModal(uuid);
        }
        toggleOpen(show);
        toggleAnimate(show);
    }, [show, uuid]);

    return (
        <ModalPortal>
            {(show || animate) && (
                <>
                    <div
                        className={`modal modal--${size} ${
                            animate ? "modal--animate" : ""
                        } ${open && animate ? "modal--open" : ""}`}
                        style={
                            {
                                "--z-index": fullZIndex,
                            } as any
                        }
                    >
                        <div
                            className="modal__bg"
                            onClick={clickBg ? onClose : undefined}
                        ></div>
                        <div className="modal__content">
                            <div
                                className="modal__close text-gray-300 hover:text-gray-500 text-md cursor-pointer"
                                onClick={onClose}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </div>
                            {children}
                        </div>
                    </div>
                </>
            )}
        </ModalPortal>
    );
};

export default BaseModal;
