import create from "zustand";
import { uniqueId, uniq } from "lodash";
import { useEffect } from "react";

type ModalState = {
    modalsTarget: HTMLDivElement | null;
    modals: string[];
    openModals: string[];
    baseZIndex: number;
    generateModalUuid: () => string;
    getModalIndex: (uuid: string) => number;
    registerModal: () => string;
    unregisterModal: (uuid: string) => void;
    showModal: (uuid: string) => number;
    hideModal: (uuid: string) => void;
    registerModalsTarget: (target: HTMLDivElement) => void;
};

const boundModalState = create<ModalState>((set, get) => {
    const generateModalUuid = () => {
        return uniqueId();
    };

    const getModalIndex = (uuid: string) => {
        return get().modals.indexOf(uuid);
    };

    const registerModal = () => {
        const uuid = generateModalUuid();
        const ms = uniq([...get().modals, uuid]);
        set((draft) => ({ ...draft, modals: ms }));

        return uuid;
    };

    const unregisterModal = (uuid: string) => {
        const ms = get().modals.filter((m) => m !== uuid);
        const os = get().openModals.filter((m) => m !== uuid);

        set((draft) => ({ ...draft, modals: ms, openModals: os }));
    };

    const showModal = (uuid: string) => {
        const os = uniq([...get().openModals, uuid]);
        set((draft) => ({ ...draft, openModals: os }));

        return os.indexOf(uuid);
    };

    const hideModal = (uuid: string) => {
        const os = get().openModals.filter((m) => m !== uuid);
        set((draft) => ({ ...draft, openModals: os }));
    };

    const registerModalsTarget = (target: HTMLDivElement) => {
        set((draft) => ({ ...draft, modalsTarget: target }));
    };

    const setBaseZIndex = (zIndex: number) => {
        set((draft) => ({ ...draft, baseZIndex: zIndex }));
    };

    return {
        modalsTarget: null,
        modals: [],
        openModals: [],
        baseZIndex: 1000,
        setBaseZIndex,
        generateModalUuid,
        getModalIndex,
        registerModal,
        unregisterModal,
        showModal,
        hideModal,
        registerModalsTarget,
    };
});

const useModalState = () => {
    const modalState = boundModalState();

    useEffect(() => {
        const body = document.querySelector("body");
        if (body) {
            if (modalState.openModals.length > 0) {
                body.classList.add("modal-open");
            } else {
                body.classList.remove("modal-open");
            }
        }
    }, [modalState.openModals]);

    return modalState;
};
export default useModalState;
