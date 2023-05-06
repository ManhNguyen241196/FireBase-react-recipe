import firebase from "./FireBaseConfig"; // tat ca firebase deu phai duoc goi ra
//tu file firebaseConfig thif moi co the su dung dk vi no dk tao bang cac thong tin
// dk dang nhap thon tin ca nhan truoc do.

const auth = firebase.auth();

const registerUser = (email, password) => {
  // đăng kí ng dùng mới
  return auth.createUserWithEmailAndPassword(email, password);
};

const loginUser = (email, password) => {
  // đăng nhập ng dùng
  return auth.signInWithEmailAndPassword(email, password);
};

const logoutUser = () => {
  // đăng xuất
  return auth.signOut();
};

const sendPasswordResetEmail = (email) => {
  // reset lại maatk khẩu qua email
  return auth.sendPasswordResetEmail(email);
};

const loginWithGoogle = () => {
  // đăng nhập với google sẽ k cần truy cập cơ sở dữ liệu user
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
};

//để lấy ra thông tin của user đăng nhập va setUser để thay đổi giá trị biến user. ý là để xác nhận
//là có tồn tại user hay không.
const subscribeToAuthChanges = (handleAuthChange) => {
  auth.onAuthStateChanged((user) => {
    handleAuthChange(user);
  });
};

const FirebaseAuthService = {
  // tạo ra 1 object để tóm gọn các hàm trên để export cả cụm cho dễ
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail,
  loginWithGoogle,
  subscribeToAuthChanges,
};
export default FirebaseAuthService;
