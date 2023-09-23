import React from "react";
import UserHeader from "./UserHeader";
import { Route, Routes } from "react-router-dom";
import Feed from "../Feed/Feed";
import UserPhotoPost from "./UserPhotoPost";
import UserStats from "./UserStats";
import { useUser } from "../../UserContext";
import NotFound404 from "../Helper/404/NotFound404";
import Head from "../Helper/Head";
import Loading from "../Helper/Loading";
const UserChat = React.lazy(() => import("./Chat/UserChat"));

const User = () => {
  const { data } = useUser();
  return (
    <section className="container">
      <Head title="Minha Conta" />
      <UserHeader />
      <Routes>
        <Route path="/" element={<Feed user={data.id} />} />
        <Route path="post" element={<UserPhotoPost />} />
        <Route path="stat" element={<UserStats />} />
        <Route
          path="chat"
          element={
            <React.Suspense fallback={<Loading />}>
              <UserChat />
            </React.Suspense>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </section>
  );
};

export default User;
