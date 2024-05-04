import "./App.css";
import {Route,Routes} from "react-router-dom"
import {Home} from "./pages/Home"
import {Navbar} from "./components/common/Navbar"
import LoginForm from "./components/core/Auth/LoginForm"
import SignupForm from "./components/core/Auth/SignupForm";
import { ForgotPassword } from "./pages/ForgotPassword";
import { UpdatePassword } from "./pages/UpdatePassword";
import OpenRoute from './components/core/Auth/OpenRoute'
import { VerifyEmail } from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Error from "./pages/Error";
import Settings from "./components/core/Dashboard/Settings";
import Cart from './components/core/Dashboard/Cart/index'
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import { useSelector } from "react-redux";
import MyCourses from "./components/core/Dashboard/MyCourses";
import AddCourse from "./components/core/Dashboard/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse/EditCourse";
import CatalogPage from ".//pages/CatalogPage";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewDetails";
import VideoDetails from "./components/core/Dashboard/ViewCourse/VideoDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
function App() {
  const {user}= useSelector((state)=>state.profile)
  return (
    
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='catalog/:catalogName' element={<CatalogPage/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path="courses/:courseId" element={<CourseDetails/>} />
        <Route path="/login" element={<OpenRoute><LoginForm/></OpenRoute>}/>
        <Route path="/signup" element={<OpenRoute><SignupForm/></OpenRoute>}/>
        <Route path="/forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>}/>
        <Route path="/update-password/:token" element={<OpenRoute><UpdatePassword/></OpenRoute>}/>
        <Route path="/verify-otp" element={<OpenRoute><VerifyEmail/></OpenRoute>}/>

        <Route element={<PrivateRoute><Dashboard/></PrivateRoute>}>
          <Route path="dashboard/my-profile" element={<MyProfile/>}/>
          <Route path="dashboard/settings" element={<Settings/>}/>
          {
            user?.accountType === "Student" && (
              <>
              <Route path="dashboard/cart" element={<Cart/>}/>
              <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>}/>
              </>
            )
            }
          {
            user?.accountType === "Instructor" && (
              <>
              <Route path="dashboard/instructor" element={<Instructor />} />
              <Route path="dashboard/my-courses" element={<MyCourses/>}/>
              <Route path="dashboard/add-course" element={<AddCourse/>}/>
              <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>}/>
              </>
            )
            }
        </Route>
        <Route element={
        <PrivateRoute>
          <ViewCourse />
        </PrivateRoute>
      }>

      {
        user?.accountType === "Student" && (
          <>
          <Route 
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
          </>
        )
      }

      </Route>
        <Route path="*" element={<Error/>}/>
      </Routes>
    </div>
  );
}

export default App;
