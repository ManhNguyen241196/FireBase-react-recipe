import firebase from "./FireBaseConfig";

const storageRef = firebase.storage().ref(); // truy cập tới 1 tham chiếu 1 reference của dữ liệu dk luuw trên storage.
// khi gọi tới nó sẽ k tủy cập và lấy haowjc tác động trực tiếp vào dữ liệu như bên lưu trữ dám mây bình thuwofng mà sẽ tương tác tới tham chiếu
//tới data đó. VÌ đơn giản data đó k phải là 1 định dạng boolean hay string mà là dạng ảnh hoặc video được mã hóa nhiều keieur dữ liệu và
// chỉ có tham chiếu là đường dẫn có thể quy về kiểu dữ liệu  nên có thể tương tác thoải mái với các tham chiếu đó chứ k phải mất công
// theo tác với dữ liệu ảnh hay video có dung lượng lớn.

const uploadFile = (file, fullFilePath, progressCallback) => {
  const uploadTask = storageRef.child(fullFilePath).put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // show ra trang thai
      // đang uplaod dữ liệu lên. Cụ thể ở đây là sử dụng data đếm số byte từ phương thức snapshot để xem
      // dữ liệu dk tải lên bao nhiêu % trên tổng số dữ liệu cần tải
      progressCallback(progress);
    },
    function (error) {
      console.log(error);
    }
  );

  return uploadTask.then(async () => {
    //  sử dụng phương thức ref của snapshot để lấy URL
    //sau khi uploadTask thực hiện xong toàn bộ quá tình và trả lại 1 promise
    const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
    return downloadUrl; // cuối cùng của toàn bộ method này promise trả lại 1 url chứa ảnh vừa up lên trong filebase storage
  });
};

const deleteFile = (fileDownloadUrl) => {
  const decodedUrl = decodeURIComponent(fileDownloadUrl);
  const startIndex = decodedUrl.indexOf("/o/") + 3;
  const endIndex = decodedUrl.indexOf("?");
  const filePath = decodedUrl.substring(startIndex, endIndex);

  return storageRef.child(filePath).delete();
};

const FirebaseStorageService = {
  uploadFile,
  deleteFile,
};

export default FirebaseStorageService;
