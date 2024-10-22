import { useContext, useState } from 'react'
import { ThemeContext } from '@emotion/react'
import { useThemeContext } from './contexts/ThemeContextProvider'
import ChatDrawer from '../shared/ChatDrawer';
import Auth from '../components/auth/Auth';
import {Route, BrowserRouter as Router, Routes, useNavigate} from'react-router-dom';
import AuthContextProvider from './contexts/AuthContext';
import ConversationContextProvider from './contexts/ConversationContext';
import { Toaster } from 'react-hot-toast'
import SocketContextProvider from './contexts/SocketContextProvider';
import { IKContext } from 'imagekitio-react';
import ImageKitContextProvider from './contexts/ImageKitContext';
import axios from 'axios';
import { CssBaseline } from '@mui/material';
import { CookiesProvider, useCookies } from 'react-cookie';

const BASE_URL = import.meta.env.VITE_BASE_URL;
function App() {
  const [count, setCount] = useState(0)
  const {mode,handleSetTheme }= useThemeContext();
  const [cookies] = useCookies(['token']); // Access cookies
  const authenticator = async (callback) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/img-kit/auth`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`, // Include the token
        },
        withCredentials: true, // Include cookies if needed
      });
      if(response?.status!==200){
        throw new Error(`Request failed with status ${response.status}`);
      }
      const {signature,expire,token}=response?.data ;
      //console.log("sig ",signature,"exp ",expire,"tok ",token);
      return {signature,expire,token}
    } catch (error) {
      console.error("Authenticator Error:", error);
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  return (
    <Router>
      <IKContext 
        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_URL_ENDPOINT}
        publicKey={import.meta.env.VITE_IMAGE_KIT_PUBLICKEY}
        authenticator={authenticator}

      >
        <ImageKitContextProvider>
          
          <AuthContextProvider>
            <SocketContextProvider>
              <ConversationContextProvider>
                <CssBaseline/>
                <Routes>
                  <Route path='/' element={<ChatDrawer/>}/>
                  <Route path='/auth' element={<Auth/>} />
                  <Route path="/chat/:chatId" element={<ChatDrawer/>} />
                </Routes>
                <Toaster position='top-right' reverseOrder={false}/>   
              </ConversationContextProvider>
            </SocketContextProvider>
          </AuthContextProvider>   
        </ImageKitContextProvider>
      </IKContext>
    </Router>
    
  )
}

export default App
