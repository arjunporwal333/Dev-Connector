import { Fragment, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./flux/store";
import './App.css';
import { LoadUser } from "./flux/actions/auth";
import setToken from "./utils/setToken";

/****************** Components ******************/
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dasboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddEducation from "./components/profile-forms/AddEducation";
import AddExperience from "./components/profile-forms/AddExperience";
import PrivateRoute from "./components/routing/PrivateRoute";
import Posts from "./components/posts/Post";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import PostDiscussion from "./components/post/Post";
import NotFound from "./components/layout/NotFound";

if (localStorage.token) {
  setToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    Store.dispatch(LoadUser());
  }, [])

  return (
    <Provider store={Store}>
      <BrowserRouter>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <section className="container">
                <Alert />
              <Fragment>
                <Switch>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/profiles" component={Profiles} />
                  <Route exact path="/profile/:id" component={Profile} />
                  <PrivateRoute exact path="/dashboard" component={Dasboard} />
                  <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                  <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                  <PrivateRoute exact path="/add-experience" component={AddExperience} />
                  <PrivateRoute exact path="/add-education" component={AddEducation} />
                  <PrivateRoute exact path="/posts" component={Posts} />
                  <PrivateRoute exact path="/posts/:id" component={PostDiscussion} />
                  <Route component={NotFound} />
                </Switch>
              </Fragment>
            </section>
          </Switch>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
