import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "@/config/BaseUrl";
import { format } from "date-fns";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const now = new Date();
  const formattedDate = format(now, "EEEE, MMMM d, yyyy 'at' h:mm a");

  const [userType, setUserType] = useState(null);
  const [nameL, setNameL] = useState(null);
  const [emailL, setEmailL] = useState(null);
  const [matchId, setMatchId] = useState(null);


  
  useEffect(() => {
    // Fetch stored values and set state
    const storedUserType = localStorage.getItem("userType");
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedMatchId = localStorage.getItem("id");

    setUserType(storedUserType);
    setNameL(storedName);
    setEmailL(storedEmail);
    setMatchId(storedMatchId);
  }, []);


 

  return (
    <ContextPanel.Provider
      value={{
       
        userType,
        nameL,
        emailL,
        matchId,
        formattedDate,
     
      }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
