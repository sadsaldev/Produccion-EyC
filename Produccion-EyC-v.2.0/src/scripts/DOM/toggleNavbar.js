import { restorePreviousState } from "./previousSection";
import { globalState } from "../helpers/global";

export function toggleNavbar() {
    $('#menu-toggle').on('click', function (e){
        e.preventDefault();

        if (globalState.isNavbarVisible) {
            $('#blur-background-2').fadeOut(300, function() {
                $('.flex-navbar-menu').fadeIn(300);
                if (localStorage.getItem('activeSection') === 'queries-link' || localStorage.getItem('activeSection') === 'profile-link') {
                    if (!globalState.isInSubsection) {
                        $('#blur-background').fadeIn(300);
                        $('#profile-content').fadeIn(300);
                    }
                }
            });
        } else {
            $('#blur-background').fadeOut(300);
            $('#profile-content').fadeOut(300);
            $('.flex-navbar-menu').fadeOut(300);
            $('#blur-background-2').fadeIn(300);
        }

        globalState.isNavbarVisible = !globalState.isNavbarVisible;
    });

    $('#blur-background-2').on('click', function (){
        if (globalState.isNavbarVisible) {
            $('#blur-background-2').fadeOut(300, function(){
                if(localStorage.getItem('activeSection') === 'queries-link' || localStorage.getItem('activeSection') === 'profile-link'){
                    if (!globalState.isInSubsection){
                        $('#blur-background').fadeIn(300);
                        $('#profile-content').fadeIn(300);
                    }
                }
            });
            globalState.isNavbarVisible = false;
        }
    });

    $('#blur-background').on('click', function (){
        restorePreviousState();
    });
}