import React from "react";

const SideBarTop = () =>{
return(
    <div className="sideBarTop">
         <div className="userChatInfor">
            <h5>SEN</h5>
        </div>
        <div className="userInfor">
            <h6>Tharindu</h6>
            <div className="userChatImage">
                <img
                src="https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"
                alt=""
                />
            </div>
            <button className="logoutButton">LogOut</button>
        </div>
       
    </div>
)
}

export default SideBarTop;