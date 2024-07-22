import { globalState } from './scripts/helpers/global';
import { toggleNavbar } from './scripts/DOM/toggleNavbar';
import { navEvents} from './scripts/DOM/navEvents';
import { themeToggle } from './scripts/DOM/pageTheme';
import { duplicateLogout } from './scripts/sessions/logoutEvents';
import { logoutUser } from './scripts/sessions/sessionManager';
import { closePopUps } from './scripts/helpers/closePopUps';
import { generateUniqueId } from './scripts/helpers/uniqueID';
import { changeSection } from './scripts/queries/helpers/changeSection';

document.addEventListener('DOMContentLoaded', () => {
    toggleNavbar();
    navEvents();
    closePopUps();
    themeToggle();
  
    let currentTabID = sessionStorage.getItem('tabID');
    if (!currentTabID) {
        currentTabID = generateUniqueId();
        sessionStorage.setItem('tabID', currentTabID);
    }

    let activeTabID = localStorage.getItem('activeTabID');
    if (activeTabID && currentTabID !== activeTabID) {
        logoutUser();
    }

    duplicateLogout(); 

    if (sessionStorage.getItem('sessionActive') === 'true'){
        if (!localStorage.getItem('initialSessionStarted')){
            localStorage.setItem('initialSessionStarted', 'true');
        } else {
            logoutUser().then(() => {
                window.location.reload();
            });
        }
    } else {
        localStorage.setItem('initialSessionStarted', 'true');
    }

    window.addEventListener('storage', function(e){
        if (e.key === 'logoutEvent'){
            sessionStorage.setItem('sessionActive', 'false');
            window.location.reload();
        }
    });

    const observer = new MutationObserver(() => {
        const mainTableVisible = $('.main-table-container').is(':visible');
        const groupedTableVisible = $('.grouped-container').is(':visible');
    
        if (mainTableVisible) {
            changeSection('mainTable');
        } else if (groupedTableVisible) {
            changeSection('groupedTable');
        } else {
            changeSection(null);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});