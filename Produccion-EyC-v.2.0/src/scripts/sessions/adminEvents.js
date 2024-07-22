import { globalState } from "../helpers/global";
import { ajaxAdminPanel } from "../services/ajaxAdminPanel";
import { ajaxDeleteUser } from "../services/ajaxDeleteUser";
import { ajaxToggleUserStatus } from "../services/ajaxToggleUserStatus";
import { hideBackground, showBackground } from "../helpers/backgroundHandler";

export function adminEvents() {
    if (globalState.user && globalState.user.userRole === "super_user"){
        adminPanel();
    }
}

function adminPanel() {
    $('#profile-content').off('click', '#admin-panel').on('click', '#admin-panel', function(e){
        if (globalState.user && globalState.user.userRole === "super_user"){
            e.preventDefault();
            $(this).toggleClass('active');
            $('#profile-content #user-accounts-control').toggle();
            if ($('#profile-content #user-accounts-control').is(':hidden')) {
                $(this).removeClass('active');
            }
            accountsControl();
        } 
    });
}

function accountsControl() {
    $('#profile-content').off('click', '#user-accounts-control').on('click', '#user-accounts-control', function(e){
        if (globalState.user && globalState.user.userRole === "super_user"){
            e.preventDefault();
            ajaxAdminPanel();
            toggleUserStatus();
            deleteUser();
            closeAdminPanel();
        } else {
            window.alert("No estás autorizado para ejecutar esta acción.");
            return;
        }
    });
}

function toggleUserStatus() {
    $('#profile-content').off('click', '.toggleUserStatus').on('click', '.toggleUserStatus', function(e){
        if (globalState.user && globalState.user.userRole === "super_user"){
            e.preventDefault();
            let userID = $(this).data('user-id');
            ajaxToggleUserStatus(userID);
        } else {
            window.alert("No estás autorizado para ejecutar esta acción.");
            return;
        }
    });
}

function deleteUser() {
    $('#profile-content').off('click', '.deleteUser').on('click', '.deleteUser', function(e){
        if (globalState.user && globalState.user.userRole === "super_user"){
            e.preventDefault();
            if (window.confirm('¿Seguro que quieres eliminar este usuario?')){
                let userID = $(this).data('user-id');
                ajaxDeleteUser(userID);
            } else {
                return;
            }
        } else {
            window.alert("No estás autorizado para ejecutar esta acción.");
            return;
        }
    });
}

function closeAdminPanel() {
    $('#profile-content').off('click', '#close-admin-panel').on('click', '#close-admin-panel', async function(e){
        e.preventDefault();
        await hideBackground('#profile-content .admin-panel-container');
        $('#profile-content .pop-ups-container').hide();
        await showBackground('#profile-content .profile-container');
    });
}

