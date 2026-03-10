import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

export default function Layout({ children }: any) {

  return (

    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1, marginLeft: 260 }}>

        <Header />

        {children}

      </div>

    </div>

  );

}