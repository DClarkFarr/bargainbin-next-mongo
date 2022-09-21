import nextSession from "next-session";
export const getSession = nextSession({
    name: "ssid",
});
