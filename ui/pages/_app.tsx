import "../styles/common.css";
import Layout from "../components/Layout";
import RequireLogin from "../components/RequireLogin";

function App({ Component, pageProps }) {
  return (
    <RequireLogin>
      <Layout title="Hello for Book Shop Example"></Layout>
      <Component {...pageProps}></Component>
      <div>
        <footer className="">
          <hr />
        </footer>
      </div>
    </RequireLogin>
  );
}

export default App;
