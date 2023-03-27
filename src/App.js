// import { HashRouter as Router, Route, Switch } from "react-router-dom";
// HashRouter, BrowserRouter: HashRouter가 deploy하기 훨씬 쉬움
// BrowserRouter의 경우 deploy할 때 몇 가지 고려 사항이 생김
import { useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './screens/Home';
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import { darkModeVar, isLoggedInVar } from './apollo';
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme, GlobalStyles } from "./styles";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const darkMode = useReactiveVar(darkModeVar);
  // Reactive Variables 기본적으로 반응하고 변하는 variable
  // Props를 계속해서 전달하는 걸 원하지 않기 때문에 사용

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route path="/" exact>
            {isLoggedIn ? (<Home />) : (<Login />)}
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
