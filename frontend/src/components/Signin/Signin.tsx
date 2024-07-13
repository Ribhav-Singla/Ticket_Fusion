import { useState } from "react";
import "./Signin.css";
import { SigninInputType } from "@ribhavsingla/eventcommon";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { userState } from "../../Recoil";
import sidesvg from '/sidesvg.svg?url'

export default function Signin() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState)

  const [signinDetails, setSigninDetails] = useState<SigninInputType>({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`,
        {
          email: signinDetails.email,
          password: signinDetails.password,
        }
      );

      const token = `Bearer ${response.data.token}`;
      localStorage.setItem("token", token);
      toast.success("signed in");
      setUser(response.data.name)
      navigate("/");
    } catch (error) {
      //@ts-ignore
      console.log("error: ", error.response.data.message);
      //@ts-ignore
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="hidden md:block md:col-span-5 lg:col-span-6 bg-slate-50 left-signin min-h-screen">
          <div className="flex justify-center items-center">
            <img src={sidesvg} width={550} className="ml-7" />
          </div>
        </div>

        <div className=" col-span-12 md:col-span-7 lg:col-span-6">
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 signup--container">
            <div className="mx-auto max-w-lg">
              <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">
                Access Your Account
              </h1>

              <p className="mx-auto mt-4 max-w-lg text-center text-gray-500 px-4">
                Welcome back! We're glad to see you again. Please sign in to
                access your account and continue enjoying our services.
              </p>

              <form
                className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
                onSubmit={handleSubmit}
              >
                <div>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                      placeholder="Enter email"
                      required
                      onChange={(e) => {
                        setSigninDetails((prev) => {
                          return {
                            ...prev,
                            email: e.target.value,
                          };
                        });
                      }}
                    />
                    <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-envelope-at"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                        <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                      placeholder="Enter password"
                      required
                      minLength={6}
                      onChange={(e) => {
                        setSigninDetails((prev) => {
                          return {
                            ...prev,
                            password: e.target.value,
                          };
                        });
                      }}
                    />

                    <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-shield-check"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                        <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                      </svg>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
                >
                  Sign in
                </button>

                <p className="text-center text-sm text-gray-500">
                  No account?&nbsp;
                  <a className="underline" href="#">
                    <Link to="/signup">Sign up</Link>
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
