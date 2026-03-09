import Sidebar from "../../components/layout/Sidebar";

export default function Layout({ children }: any) {

  return (

    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1, padding: 0 }}>
        {children}
      </div>

    </div>

  );

}