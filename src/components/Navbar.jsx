import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserData } from "../Context/userData";
import axios from "axios";
import { FaBars } from "react-icons/fa";

const NavBar = (props) => {
    const { userName, setUserName, email, setEmail} = useUserData();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const LogOut = async () => {
        try {
            localStorage.removeItem("authToken");
            delete axios.defaults.headers.common["Authorization"];
            setUserName(null);
            navigate('/');
        } catch (error) {
        }
    };
    
    return (
        <>
        {isMobile ? (
        <nav className={`${userName ? "bg-gradient-to-r from-[#43b0f1] to-[#057dcd]" : "bg-black"} text-white font-bold p-3 text-[18px] px-6 flex items-center justify-between fixed z-50 w-full`}>
        <div className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars size={28} />
        </div>
        <div className="flex flex-row justify-end gap-4">
        {userName ? (<div className="flex items-center gap-4">
            {userName && <div className="cursor-pointer" onClick={() => { navigate('/profile')}}>{userName}</div>}
            {userName && <div className="cursor-pointer" onClick={LogOut}>Log Out</div>}
        </div>) : (<>
            {<div className="cursor-pointer" onClick={() => { navigate('/signup')}}>Sign Up</div>}
            {<div className="cursor-pointer" onClick={() => { navigate('/login')}}>Login</div>}
            </>
        )}
        </div>
        {menuOpen && (
            <div className={`absolute top-14 left-0 w-full ${userName ? "bg-gradient-to-r from-[#43b0f1] to-[#057dcd]" : "bg-black"} shadow-md opacity-90 z-10 w-full`}>
                <div className="flex flex-col p-4 gap-4">
                    <div className="cursor-pointer" onClick={() => { navigate('/'); setMenuOpen(false); }}>Home</div>
                    {userName && (
                        <div className="cursor-pointer" onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>
                            Dashboard
                        </div>
                    )}
                </div>
            </div>
        )}
    </nav>
    //Desktop Starts
    ) : (
        <div className={`flex flex-row gap-12 ${userName ? "bg-gradient-to-r from-[#43b0f1] to-[#057dcd]" : "bg-black"} text-white font-bold p-3 pl-6 items-center fixed w-full z-50`}>
            <div className="cursor-pointer" onClick={()=>{navigate('/')}}>Home</div>
            {userName && (<>
                <div className="cursor-pointer" onClick={()=>{navigate('/dashboard')}}>Dashboard</div>
                </>
            )}
            <div className="cursor-pointer"></div>
            <div className="ml-auto flex flex-row gap-8 mr-6">
            {!userName ? (<>
            <div className="cursor-pointer" onClick={()=>{navigate('/signup')}}>Sign Up</div>
            <div className="cursor-pointer" onClick={()=>{navigate('/login')}}>Login</div>
            </> ) : <>
            <div className="cursor-pointer" onClick={()=>{navigate('/profile')}}>{userName}</div>
            <div className="cursor-pointer" onClick={LogOut}>Log Out</div>
            </>
            }
            </div>
        </div>
    )}
    </>
);
}

export default NavBar;