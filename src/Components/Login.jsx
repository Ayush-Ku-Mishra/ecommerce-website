import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Context } from "../main";
import axios from "axios";
import toast from "react-hot-toast";
import Logo from "../assets/PickoraLogo1.png";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import LoginComponent from "../pages/LoginComponent";
import RegisterComponent from "../pages/RegisterComponent";
import OtpVerification from "../pages/OtpVerification";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../firebase";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const AuthLoadingOverlay = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <CircularProgress size={40} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Please wait...
          </h3>
          <p className="text-gray-600 text-center text-sm">
            {message || "Verifying your account..."}
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full animate-pulse"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const { isAuthenticated, setIsAuthenticated, setUser, user } =
    useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  // Add login/register toggle state
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProgress, setAuthProgress] = useState("");

  // Views: otp, forgotPassword, resetPassword
  const [currentView, setCurrentView] = useState("login");
  const [resetEmail, setResetEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false); // loader state

  // We will store registration email/phone for OTP screen if needed.
  const [registerData, setRegisterData] = useState({ email: "", phone: "" });

  // Sync isLogin and currentView for login/register toggling
  useEffect(() => {
    if (isLogin && currentView !== "login") {
      setCurrentView("login");
    } else if (!isLogin && currentView !== "register") {
      setCurrentView("register");
    }
  }, [isLogin]);

  // Using react-hook-form for login and register forms
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Show password state for login and registration password fields
  const [showPassword, setShowPassword] = useState(false);

  // Determine where to redirect after login (Wishlist page or home)
  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (data) => {
    if (currentView === "register") {
      setRegisterLoading(true);
      try {
        // Format phone number
        data.phone = data.phone.startsWith("+91")
          ? data.phone
          : `+91${data.phone}`;

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          setRegisterData({
            email: data.email,
            phone: data.phone,
            verificationMethod: data.verificationMethod,
          });
          setCurrentView("otp");
        }
      } catch (error) {
        console.error("Registration error:", error.response?.data || error);

        // Handle based on status code and message content
        const errorMessage = error.response?.data?.message || "";
        const statusCode = error.response?.status;

        if (statusCode === 403 && errorMessage.includes("suspended")) {
          // Account suspended error
          toast.error(
            "This account has been suspended. Please contact our support team for assistance.",
            { duration: 5000 }
          );
        } else if (
          statusCode === 400 &&
          errorMessage.includes("already registered")
        ) {
          // Account already exists
          toast.error(
            "This email or phone is already registered. Please log in instead.",
            { duration: 3000 }
          );
        } else if (statusCode === 429) {
          // Rate limiting
          toast.error(
            "Too many attempts. Please wait a few minutes before trying again.",
            { duration: 3000 }
          );
        } else if (
          errorMessage.includes("email") &&
          errorMessage.includes("configuration")
        ) {
          // Email service issues
          toast.error(
            "We're having trouble sending verification emails. Please try phone verification instead.",
            { duration: 4000 }
          );
        } else if (
          errorMessage.includes("SMS") ||
          errorMessage.includes("phone")
        ) {
          // SMS service issues
          toast.error(
            "We're having trouble sending SMS. Please try email verification instead.",
            { duration: 4000 }
          );
        } else {
          // Generic error
          toast.error(
            "We couldn't complete your registration. Please try again or contact support.",
            { duration: 3000 }
          );
        }
      } finally {
        setRegisterLoading(false);
      }
      return;
    }

    if (currentView === "login") {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
          { email: data.email, password: data.password },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.token) {
          localStorage.setItem("client_token", response.data.token);
          localStorage.setItem(
            "client_user",
            JSON.stringify(response.data.user)
          );
        }

        toast.success(response.data.message);
        setIsAuthenticated(true);
        setUser(response.data.user);
        navigate(redirectTo, { replace: true }); // <--- Redirect to wishlist or home
      } catch (error) {
        console.error("Login error:", error.response?.data || error);

        // Handle based on status code and message content
        const errorMessage = error.response?.data?.message || "";
        const statusCode = error.response?.status;

        if (statusCode === 403 && errorMessage.includes("suspended")) {
          // Account suspended
          toast.error(
            "Your account has been suspended. Please contact our support team for assistance.",
            { duration: 5000 }
          );
        } else if (statusCode === 401 || errorMessage.includes("Invalid")) {
          // Authentication failure
          toast.error(
            "The email or password you entered is incorrect. Please try again.",
            { duration: 3000 }
          );
        } else if (statusCode === 404 || errorMessage.includes("not found")) {
          // User not found
          toast.error(
            "We couldn't find an account with this email. Please check your email or create an account.",
            { duration: 4000 }
          );
        } else if (errorMessage.includes("verify")) {
          // Unverified account
          toast.error(
            "Please verify your account first. Check your email or phone for the verification code.",
            { duration: 4000 }
          );
        } else {
          // Generic error
          toast.error(
            "We couldn't sign you in. Please try again later or contact support.",
            { duration: 3000 }
          );
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setRegisterLoading(true);
    setIsAuthenticating(true);
    setAuthProgress("Initializing Google Sign-In...");

    try {
      // Configure popup to avoid CORS issues
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");

      setAuthProgress("Opening Google login...");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google Sign-In Result:", user);

      setAuthProgress("Google login successful, verifying account...");

      // Prepare user data for backend
      const userData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL || "",
        phone: user.phoneNumber || null,
        role: "user",
      };

      console.log("Sending user data to backend:", userData);
      setAuthProgress("Connecting to server...");

      // Send data to backend - always use authWithGoogle endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/authWithGoogle`,
        userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Backend response:", response.data);
      setAuthProgress("Finalizing your login...");

      // Handle successful authentication
      if (response.data.success) {
        // Store token if provided
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }

        toast.success(response.data.message || "Login successful!");

        // Update context
        setIsAuthenticated(true);
        setUser(response.data.user);

        // Navigate to intended page
        navigate(redirectTo, { replace: true });
      } else {
        throw new Error(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);

      // First check for axios errors with response
      if (error.response) {
        // Check specifically for suspended account messages
        if (error.response.status === 403) {
          if (error.response.data && error.response.data.message) {
            if (error.response.data.message.includes("suspended")) {
              toast.error(
                "Your account has been suspended. Please contact customer support for assistance.",
                { duration: 6000 }
              );
            } else {
              toast.error(error.response.data.message);
            }
          } else {
            toast.error(
              "Access denied. Please contact customer support if you need help."
            );
          }
        } else if (error.response.status === 500) {
          toast.error(
            "We're experiencing technical difficulties. Please try again later."
          );
        } else if (error.response.status === 400) {
          toast.error(
            error.response.data.message ||
              "Something went wrong with your request."
          );
        } else if (error.response.status === 404) {
          toast.error("Service unavailable. Please try again later.");
        } else {
          // Show the actual error message from the server if available
          toast.error(
            error.response.data.message || "Sign-in failed. Please try again."
          );
        }
      }
      // Handle specific Firebase errors
      else if (error.code && error.code.startsWith("auth/")) {
        const firebaseErrors = {
          "auth/popup-closed-by-user":
            "Sign-in was cancelled. Please try again.",
          "auth/popup-blocked":
            "Pop-up was blocked. Please allow pop-ups for this site.",
          "auth/network-request-failed":
            "Network error. Please check your connection.",
          "auth/too-many-requests":
            "Too many attempts. Please try again later.",
          "auth/account-exists-with-different-credential":
            "An account already exists with this email using a different sign-in method.",
          "auth/cancelled-popup-request":
            "Another sign-in popup is already open.",
        };

        toast.error(
          firebaseErrors[error.code] || "Sign-in failed. Please try again."
        );
      }
      // Handle network/timeout errors
      else if (error.code === "ECONNABORTED") {
        toast.error(
          "Connection timed out. Please check your internet and try again."
        );
      } else if (error.message && error.message.includes("Network Error")) {
        toast.error(
          "Unable to connect. Please check your internet connection."
        );
      }
      // Generic error
      else {
        toast.error("Unable to sign in at this time. Please try again later.");
      }
    } finally {
      setRegisterLoading(false);
      setIsAuthenticating(false);
      setAuthProgress("");
    }
  };

  // Optional: Add a retry mechanism
  const handleGoogleSignInWithRetry = async (retryCount = 0) => {
    const maxRetries = 2;

    try {
      await handleGoogleSignIn();
    } catch (error) {
      if (retryCount < maxRetries && error.response?.status >= 500) {
        console.log(
          `Retrying Google auth (attempt ${retryCount + 1}/${maxRetries + 1})`
        );
        setTimeout(() => handleGoogleSignInWithRetry(retryCount + 1), 2000);
      } else {
        throw error;
      }
    }
  };

  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    clearAllStates();
    reset(); // Clear react-hook-form fields on toggle
  };

  const handleForgotPasswordBack = () => {
    setCurrentView("login");
    setIsLogin(true);
  };

  const handleResetPasswordRequest = (email) => {
    setResetEmail(email);
    setCurrentView("resetPassword");
  };

  const handleResetPasswordBack = () => {
    setCurrentView("forgotPassword");
  };

  const handleResetPasswordSuccess = () => {
    setResetEmail("");
    setCurrentView("login");
    setIsLogin(true);
  };

  const clearAllStates = () => {
    reset();
    setShowPassword(false);
  };

  const renderHeader = () => {
    const titles = {
      login: "Welcome Back",
      register: "Create Account",
      otp: "Verify OTP",
      forgotPassword: "Forgot Password",
      resetPassword: "Reset Password",
    };
    return (
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center mb-2">
          <img
            src="/PickoraFavicon.png"
            alt="Pickora Icon"
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-11 md:h-11 rounded-full object-cover"
          />
        </div>
        <img
          src={Logo}
          alt="Pickora Logo"
          className="mx-auto h-10 sm:h-10 md:h-12"
        />
        {titles[currentView] && (
          <p className="text-gray-600 text-sm mt-2">{titles[currentView]}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center lg:p-4 p-0"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full h-screen lg:h-auto lg:flex">
        {/* Left side content - Only visible on desktop */}
        <div className="hidden lg:flex lg:w-[70%] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-violet-800/80 to-indigo-900/90" />
          <div className="relative w-full flex flex-col justify-between p-16 text-white">
            {/* Content same as before */}
            <div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-100">
                Pickora
              </h1>
            </div>

            <div className="flex flex-col items-start space-y-6">
              <h2 className="text-6xl font-bold leading-tight">
                Discover the Art <br />
                of Shopping
              </h2>
              <p className="text-xl text-gray-200 max-w-xl">
                Join millions of shoppers who have discovered the convenience of
                online shopping with Pickora. Your perfect shopping experience
                awaits.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  Premium Quality
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  24/7 Support
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✓</span>
                  Secure Shopping
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                    alt={`User ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-300">
                Join <span className="font-semibold text-white">2,000+</span>{" "}
                happy shoppers today
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Form container */}
        <div className="w-full lg:w-[30%] min-h-screen lg:min-h-0 flex items-center justify-center bg-white/95 backdrop-blur-sm lg:backdrop-blur-none lg:bg-white">
          <div className="w-full max-w-sm p-8 lg:p-12">
            {renderHeader()}
            {/* Loader only for register form */}
            {currentView === "register" && (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={registerLoading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
            {currentView === "otp" && (
              <OtpVerification
                email={registerData.email}
                phone={registerData.phone}
                verificationMethod={registerData.verificationMethod}
                setCurrentView={setCurrentView}
                setIsLogin={setIsLogin}
                clearAllStates={clearAllStates}
                isForgotPassword={false}
                onBack={() => {
                  setCurrentView("register");
                  setIsLogin(false);
                }}
              />
            )}
            {currentView === "forgotPassword" && (
              <ForgotPassword
                onBack={handleForgotPasswordBack}
                onResetPassword={handleResetPasswordRequest}
              />
            )}
            {currentView === "resetPassword" && (
              <ResetPassword
                email={resetEmail}
                onBack={handleResetPasswordBack}
                onSuccess={handleResetPasswordSuccess}
              />
            )}
            {["login", "register"].includes(currentView) &&
              (isLogin ? (
                <LoginComponent
                  register={register}
                  handleSubmit={handleSubmit(onSubmit)}
                  errors={errors}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  setCurrentView={setCurrentView}
                  handleGoogleSignIn={handleGoogleSignIn}
                  toggleLoginRegister={toggleLoginRegister}
                  isAuthenticating={isAuthenticating}
                />
              ) : (
                <RegisterComponent
                  register={register}
                  handleSubmit={handleSubmit(onSubmit)}
                  errors={errors}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  handleGoogleSignIn={handleGoogleSignIn}
                  toggleLoginRegister={toggleLoginRegister}
                  isAuthenticating={isAuthenticating}
                />
              ))}
          </div>
        </div>
      </div>
      <AuthLoadingOverlay isVisible={isAuthenticating} message={authProgress} />
    </div>
  );
};

export default Login;
