import { useState } from "react";
import FirebaseAuthService from "../FireBaseAuth";

function LoginForm({ existingUser }) {
  const [username, setUsername] = useState(""); // ban đầu ng dùng chưa tồn tại thì lấy thông tin ng dùng(cụ thể la tên thì là
  //chuỗi rỗng)
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await FirebaseAuthService.registerUser(username, password);

      //sau khi register xong thì input để nhập username và password sẽ về trjang thái ban đầu là trống.
      setUsername("");
      setPassword("");
    } catch (error) {
      alert(error.message);
    }
  }

  function handleLogout() {
    FirebaseAuthService.logoutUser();
  }

  async function handleSendResetPasswordEmail() {
    if (!username) {
      alert("Missing username!");
      return;
    }
    try {
      await FirebaseAuthService.sendPasswordResetEmail(username);
      alert("sent the password reset email");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLoginWithGoogle() {
    try {
      await FirebaseAuthService.loginWithGoogle();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="login-form-container">
      {existingUser ? ( // trạng thái đã login thành công
        <div className="row">
          <h3>Welcome, {existingUser.email}</h3>
          <button
            type="button"
            className="primary-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        // chua login nen sẽ không có ton tai data trong object existingUser se hien form login
        <form onSubmit={handleSubmit} className="login-form">
          {/* //onSubmit sẽ  là cách để đẩy các giá trị trong input có  */}
          <label className="input-label login-label">
            Username (email):
            <input
              type="email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-text"
            />
          </label>
          <label className="input-label login-label">
            Password:
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-text"
            />
          </label>
          <div className="button-box">
            <button className="primary-button">Submit</button>
            <button
              type="button"
              onClick={handleSendResetPasswordEmail}
              className="primary-button"
            >
              Reset Password
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={handleLoginWithGoogle}
            >
              Login with google
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default LoginForm;
