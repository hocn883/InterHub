import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import ChatBubble from "../components/Chat/ChatBubble";
function MainLayout() {
  const { currentUser } = useContext(UserContext);
  return (
    <>
      <Header/>
      <main>
        <Outlet />
          {currentUser && (
        <ChatBubble
          currentUser={currentUser}
        />
      )}
      </main>
      <Footer/>
    </>
  );
}

export default MainLayout;