import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "react-bootstrap";
import { loginUser } from "../../api/api";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Username:", email);
    console.log("Password:", password);
    try {
      const response = await loginUser({
        email: email,
        password: password,
      });
      if (response.status === 200) {
        login();
        window.location.href = "/";
      } else {
        alert("Data not valid");
        console.log("Data not valid");
      }
    } catch (error) {
      alert("Error");
      console.log(`Failed to login: ${error}`);
    }
  };

  return (
    <div className=" min-h-screen flex bg-gray-200  justify-center items-center">
      <div className=" bg-white px-8 sm:px-16 p-16 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-7 ">
          <h2 className=" text-center text-4xl tracking-wider uppercase">
            Login
          </h2>
          <div className="space-y-2">
            <div className=" space-y-6">
              <div className="flex flex-col gap-1">
                <label className=" font-light tracking-wide" htmlFor="username">
                  Username:
                </label>
                <input
                  className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  // className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-sm transition duration-700 ease-in-out"
                  type="text"
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className=" font-light tracking-wide" htmlFor="password">
                  Password:
                </label>
                <input
                  className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  // className="border border-gray-300 rounded-md p-2 focus:outline-none focus:border-rose-200 text-sm"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 text-sm text-gray-700"
              >
                Remember Me
              </label>
            </div>
          </div>

          <div className="flex justify-center flex-col">
            <Button
              onClick={() => (window.location.href = "/register")}
              variant="link"
              size="sm"
            >
              Ещё не с нами? Давно пора!
            </Button>
            <button
              type="submit"
              className=" rounded-xl bg-gray-800 px-3 py-2 font-normal tracking-wide w-full  text-white"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
