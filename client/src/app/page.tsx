import Header from "../components/user/Header";
export default function Home() {
  if (typeof window !== "undefined") {
    console.log("token", window.localStorage.getItem("token"));
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]" style={{ backgroundColor: '#f3e9ff' }}>
      <Header />
    </div>
  );
}