import Header from "@/src/components/Header";
import LoginForm from "./LoginForm";


export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 py-4">
    <div className="py-5">
      <Header />
    </div>
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
        <div className="w-full lg:w-1/2 p-6 lg:p-8">
          <LoginForm />
        </div>
        <div className="hidden lg:flex w-1/2 bg-purple-100 justify-center items-center">
          <img src="/images/login.png" alt="Login Illustration" className="w-full h-auto" />
        </div>
      </div>
    </div>
  </div>
  );
}
