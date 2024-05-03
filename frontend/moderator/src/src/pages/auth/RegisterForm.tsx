import React, { useState } from "react";
import { API } from "../../../api/api";

export function RegisterForm() {
  const api = API.getInstance();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    await api.register({
      fullname: fullname,
      email: email,
      password: password,
    });
  };

  return (
    <div className=" bg-white px-8 sm:px-16 py-16 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-8 ">
        <h2 className=" text-center text-4xl tracking-wider uppercase">
          Register
        </h2>
        <div className="space-y-3">
          <div className=" space-y-6">
            <div className="flex flex-col gap-1">
              <label className=" font-light tracking-wide" htmlFor="username">
                Fullname:
              </label>
              <input
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:border-blue-500 text-sm transition duration-700 ease-in-out"
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className=" font-light tracking-wide" htmlFor="username">
                Email:
              </label>
              <input
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:border-blue-500 text-sm transition duration-700 ease-in-out"
                type="text"
                id="email"
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
          {/* <div className="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor="remember_me" className="ml-2 text-sm text-gray-700">
              Remember Me
            </label>
          </div> */}
        </div>

        <div className="flex justify-center ">
          <button
            type="submit"
            className=" rounded-xl bg-rose-200 px-3 py-2 font-light tracking-wide w-full m-2"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
