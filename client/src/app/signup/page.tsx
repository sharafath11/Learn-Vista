
import Header from "@/src/components/Header";
import SignupForm from "./SignupForm";
export default function SignupPage() {
  return (
    <div className="bg-gradient-to-r from-white to-purple-100 min-h-screen" style={{ backgroundColor: '#f3e9ff' }}>
      <div className="p-5">
        <Header />
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <SignupForm />
      </div>
    </div>
  );
}
