import React from "react";
import SecMessanger from "./SecMessanger";
import SideBarTop from "./SideBarTop";

const Sidebar = () =>{
return(
    <div className="sidebarContainer">
        <SideBarTop/>
        <SecMessanger/>
        <SecMessanger/>
        <SecMessanger/>
        <SecMessanger/>
    </div>
)
}

export default Sidebar;