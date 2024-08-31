"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const sideMenuButton = document.getElementById("side_menu_button");
  const sideMenu = document.getElementById("navbar-user");

  const userDropMenu = document.getElementById("user-dropdown");
  const userMenuButton = document.getElementById("user-menu-button");

  sideMenuButton.onclick = () => {
    sideMenu.classList.toggle("hidden");
  };

  userMenuButton.onclick = ()=> {
    userDropMenu.classList.toggle("hidden");
  }

});
