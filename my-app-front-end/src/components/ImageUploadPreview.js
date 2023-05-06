import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import FirebaseStorageService from "../FirebaseStorageService";

function ImageUploadPreview({
  // props đưa từ component parent xuống.
  basePath,
  existingImageUrl,
  handleUploadFinish,
  handleUploadCancel,
}) {
  const [uploadProgress, setUploadProgrses] = useState(-1); //state upload img -1 là chưa upload xong
  const [imageUrl, setImageUrl] = useState(""); // state the hien su ton tai của link tham chieu url

  const fileInputRef = useRef(); // dùng ref trỏ truewjc tiếp vào thẻ input img đẻ lấy giá trị inpout hiện tại
  // sẽ lưu ở biên ngoai scope nên khi reload lại do set state thay đổi sẽ k bị reload lại giá trị ban đầu của biến này.
  // trong input ở react do có thuoc tinh ref() đứng song song voi cac thuoc tinh khac

  useEffect(() => {
    //effect để đảm bảo khi biến existingImageUrl thay đổi sẽ reload lại hiển thị của trang
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
    } else {
      setImageUrl("");
      fileInputRef.current.value = null;
    }
  }, [existingImageUrl]);

  async function handleFileChanged(event) {
    const files = event.target.files; //giá trị file củ input này được
    // lwuuwx trữ và trả lại dưới dạng 1 array.
    const file = files[0];
    if (!file) {
      // nếu change input mà k có tồn tại biến file thì hiện báo lỗi
      alert("File Select Failed. Please try again.");
      return;
    }

    const generatedFileId = uuidv4(); // nếu upload thành công sẽ định nghĩa id cho file đó

    try {
      const downloadUrl = await FirebaseStorageService.uploadFile(
        file,
        `${basePath}/${generatedFileId}`, // basePath được đưa vào thông qua parent.
        setUploadProgrses // đây chính là function đã được khai báo ở file service. nó sẽ là tác động các method tới biến
        //process đuộc định nghĩa ở file parent chứa nó.
        //uploadProgrses sẽ được trả lại bằng 1 giá trị phần trăm được trích xuất từ process lấy
        //từ snapshot .
      );

      setImageUrl(downloadUrl); // set cho state riêng ở bên component
      handleUploadFinish(downloadUrl); //set state cho file ở bên parent
      setUploadProgrses(-1);
    } catch (error) {
      //nếu upload lỗi thì process sẽ được xét thành -1 và input ref value sẽ set là null
      setUploadProgrses(-1);
      fileInputRef.current.value = null;
      alert(error.message);
      throw error;
    }
  }

  function handleCancelImageClick() {
    FirebaseStorageService.deleteFile(imageUrl);
    fileInputRef.current.value = null;
    setImageUrl("");
    setUploadProgrses(-1);
    handleUploadCancel();
  }

  return (
    <div className="image-upload-preview-container">
      <span>Upload img</span>
      <input
        type="file"
        accept="image/*" // cho phép loại tài liệu được upload lên input.
        onChange={handleFileChanged}
        ref={fileInputRef}
        hidden={uploadProgress > -1 || imageUrl} // sẽ ẩn đi nếu có tồn tại 1 imageUrl hoặc quá tình upload đang chạy
      />

      {/* neu chuwua ton tại imgUrl đồng thời qua trình tải chưa tải xong nhưng đã bắt đầu có quá trình tải thì mới chạy hiển thị quá tình tải về */}
      {!imageUrl && uploadProgress > -1 ? (
        <div>
          <label htmlFor="file">Upload Progress:</label>
          <progress id="file" value={uploadProgress} max="100">
            {uploadProgress}%
          </progress>
          <span>{uploadProgress}%</span>
        </div>
      ) : null}

      {imageUrl ? ( // chỉ xuất hiện khi đã uplaod xong file lên.
        <div className="image-preview">
          <img src={imageUrl} alt={imageUrl} className="image" />
          <button
            type="button"
            onClick={handleCancelImageClick}
            className="primary-button"
          >
            Cancel Image
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ImageUploadPreview;
