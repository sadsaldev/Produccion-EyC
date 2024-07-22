import { manualLogout, immediateLogoutOnClose, reloadLogout, inactivityLogout } from "./logoutEvents";

export function mainLogout(){
    manualLogout();
    immediateLogoutOnClose();
    reloadLogout();
    inactivityLogout();
}