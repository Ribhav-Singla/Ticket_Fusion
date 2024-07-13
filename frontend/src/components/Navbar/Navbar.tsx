import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../Recoil";

export default function () {

  const [user,setUser] = useRecoilState(userState)
  console.log(user);
  

  return (
    <Navbar fluid rounded className="border-b-2">
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-2xl font-bold text-indigo-600">
        TicketFusion
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            !user ? 
            <Avatar
              alt="User settings"
              img="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b0b4c759-ad9c-4425-a9f4-ab89e2fd9837/de8cefl-35c0bc59-59b9-42ab-b19f-5c73828bb78e.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2IwYjRjNzU5LWFkOWMtNDQyNS1hOWY0LWFiODllMmZkOTgzN1wvZGU4Y2VmbC0zNWMwYmM1OS01OWI5LTQyYWItYjE5Zi01YzczODI4YmI3OGUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.81ixeN9b4cfDmfBlskK9CUyAMDtRhYNU7lfwTI8WI5Q"
              rounded
            />
            :
            <div className=" bg-indigo-600 px-4 py-2 text-white font-bold text-xl rounded-full">
              <p>{(user[0]).toUpperCase()}</p>
            </div>
            
          }
        >
          <Link to={'/profile'}><Dropdown.Item className="text-[16px]">Profile</Dropdown.Item></Link>
          <Link to={'/purchases'}><Dropdown.Item className="text-[16px]">Purchases</Dropdown.Item></Link>
          <Link to={'/manageEvents'}><Dropdown.Item className="text-[16px]">Manage Events</Dropdown.Item></Link>
          <Dropdown.Divider />
          {
            user ? 
              <Link to="/"><Dropdown.Item className="text-[16px]" onClick={()=>{
                setUser("")
                localStorage.removeItem("token")
              }}>Sign out</Dropdown.Item></Link>
            :(
              <>
              <Link to="/signup"><Dropdown.Item className="text-[16px]" href="/signup">Sign up</Dropdown.Item></Link>
              <Link to="/signin"><Dropdown.Item className="text-[16px]">Sign in</Dropdown.Item></Link>
              </>
            )
          }
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link to="/"><Navbar.Link  className="text-[18px]">Home</Navbar.Link></Link>
        <Link to="/events"><Navbar.Link  className="text-[18px]">Events</Navbar.Link></Link>
        <Link to="/createEvent"><Navbar.Link  className="text-[18px]">Create Events</Navbar.Link></Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
