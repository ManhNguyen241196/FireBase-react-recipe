import { useState, useEffect } from "react";
import ImageUploadPreview from "./ImageUploadPreview";

function AddEditRecipeForm({
  //các biến sẽ được gọi kèm theo function này ở 1 file khác sau. Nó chính là các phuwong thức tương tác với data
  // những cái này được khai báo ở component cha hoặc con của component này
  handleAddRecipe,
  existingRecipeTest,
  handleUpdateRecipe,
  handleDeleteRecipe,
}) {
  //khai báo các method tương tác với data
  //định nghĩa các thuộc tính biến sẽ xuất hiện trên phần document sẽ hiển thị trong component nà
  const [existingRecipe, setExistingRecipe] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [directions, setDirections] = useState("");
  const [ingredients, setIngredients] = useState([]); // 1 array ingredients chứa rất các elements là các ingredientName
  const [ingredientName, setIngredientName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (existingRecipeTest) {
      setExistingRecipe(existingRecipeTest);
    }
  }, [existingRecipeTest]);

  useEffect(() => {
    console.log("ben form", existingRecipe);
    if (existingRecipe) {
      setName(existingRecipe.name);
      setCategory(existingRecipe.category);
      setDirections(existingRecipe.directions);
      setPublishDate(existingRecipe.publishDate.toISOString().split("T")[0]);
      setIngredients(existingRecipe.ingredients);
      setImageUrl(existingRecipe.imageUrl);
    } else {
      resetForm();
    }
  }, [existingRecipe]);

  function handleEditRecipeCancel() {
    setExistingRecipe(null);
  }

  function handleRecipeFormSubmit(e) {
    e.preventDefault();

    if (!imageUrl) {
      alert(" Ảnh đang bị trống. yêu cầu điền đầy");
      return;
    }

    //yêu cầu phải nhập ít nhất 1 nguyên liệu
    if (ingredients.length === 0) {
      alert("Ingredients cannot be empty. Please add at least 1 ingredient");
      return;
    }
    const isPublished = new Date(publishDate) <= new Date() ? true : false;

    const newRecipe = {
      // đây cũng chính là phần định nghĩa chính xác những gì sẽ xuất hiện trong
      // data được lưu trên firebase. (data được gửi lên là 1 object với key và value được định nghĩa
      // theo kết cấu dữ liệu mà muốn đẩy lên làm data)
      // định nghĩa 1 object chứa tất cả các state mới nhất được cập nhật từ form
      name,
      category, //đây chính là các state sau khi onchange đã được setState lại. Nên object mới này
      //chỉ việc tự động điền vào sẽ tự động gọi dk giá tri trên input hiên tại
      directions,
      publishDate: new Date(publishDate),
      isPublished,
      ingredients,
      imageUrl,
    };

    if (existingRecipe) {
      // nếu biến check tồn tại là true thì chỉ update còn chưa có thì sẽ thêm mới. Các function đó dk khai báo làm biến
      // ở đầu function. nếu các Function này không được khai báo ở các module khác thì sẽ không có dữ liệu để chạy
      //hành động submit này
      handleUpdateRecipe(newRecipe, existingRecipe.id);
    } else {
      handleAddRecipe(newRecipe);
    }
    if (existingRecipe) {
      setExistingRecipe(null);
    } else {
      resetForm();
    }
  }

  function resetForm() {
    setName("");
    setCategory("");
    setDirections("");
    setPublishDate("");
    setIngredients([]);
    setImageUrl("");
  }

  function handleAddIngredient(e) {
    if (e.key && e.key !== "Enter") {
      // trong form có input nếu nhấn phím enter thì nó sẽ bằng với việc click btn chạy function này
      // còn nếu gõ bình thuong k nhân enter thì nó sẽ chạy vào if này và return krrts thúc function luôn.
      return;
    }
    e.preventDefault(); // ngăn chặn việc gửi form đi theo phương thuwswc bình thường (khi nhấn enter)

    if (!ingredientName) {
      alert("KHông được để trống input Ingredient: ");
      return;
    }
    setIngredients([...ingredients, ingredientName]);
    console.log("da dk login hay chua:", existingRecipe);
    setIngredientName("");
  }

  function handleDeleteIngredient(ingredientName) {
    const remainingIngredients = ingredients.filter(
      (ingredient) => ingredient !== ingredientName
    );
    setIngredients(remainingIngredients);
  }

  //xử lí phần hiển thị render ra phía ng dùng
  return (
    // form nhap recipes mới
    <form
      className="add-edit-recipe-form-container"
      onSubmit={handleRecipeFormSubmit}
    >
      {existingRecipe ? <h2>Update the Recipe</h2> : <h2>Add a New Recipe</h2>}
      <div className="top-form-section">
        <div className="image-input-box">
          {" "}
          Recipes image:{" "}
          <ImageUploadPreview
            basePath="testImg"
            existingImageUrl={imageUrl}
            handleUploadFinish={(downloadUrl) => setImageUrl(downloadUrl)}
            handleUploadCancel={() => setImageUrl("")}
          >
            {" "}
          </ImageUploadPreview>
        </div>
        <div className="fields">
          <label className="recipe-label input-label">
            Recipes name:
            <input
              type="text"
              required
              value={name}
              className="input-text"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="recipe-label input-label">
            Category:
            <select
              value={category}
              className="select"
              required
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value=""></option>
              <option value="breadsSandwichesAndPizza">
                Breads, Sandwiches, and Pizza
              </option>
              <option value="eggsAndBreakfast">Eggs & Breakfast</option>
              <option value="dessertsAndBakedGoods">
                Desserts & Baked Goods
              </option>
              <option value="fishAndSeafood">Fish & Seafood</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </label>

          <label className="recipe-label input-label">
            Directions:
            <textarea
              required
              value={directions}
              onChange={(e) => {
                setDirections(e.target.value);
              }}
              className="input-text directions"
            ></textarea>
          </label>

          <label className="recipe-label input-label">
            Publish Date:
            <input
              type="date"
              required
              value={publishDate}
              className="input-text"
              onChange={(e) => setPublishDate(e.target.value)}
            />
          </label>
        </div>
      </div>
      /
      {/* Bang liệt kê list cÁc nguyên liệu trong recipe được đưa hiển thị dưới dạng table và có button xóa */}
      <div className="ingredients-list">
        <h3 className="text-center">Ingredients</h3>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th className="table-header">Ingredient</th>
              <th className="table-header">Delete</th>
            </tr>
          </thead>

          {/* table lsuc này được hiển thị hoàn toàn phụ thuộc vào biến state ingredients  
           được luuw trữ dưới dạng state ở react trong bộ nhớ tạm chứ chưa hề được đẩy lên database
           của server. Mọi thay đổi trong bảng vẫn chỉ là hiển thị bên phía ng dùng.*/}
          <tbody>
            {ingredients && ingredients.length > 0
              ? ingredients.map((ingredient) => {
                  return (
                    // key trong những pahafn map bắt buộc react yêu cầu phải có thì lúc này lí do dk show ra rõ nhất
                    // key sẽ giúp khi tác động vào thành phần nào thì sẽ xác định dk rõ chính xác thành phần đó luôn chứ
                    //k phải chạy lại vòng lặp array để xác nhận sự tác động của sự kiện vào nó.
                    <tr key={ingredient}>
                      <td className="table-data text-center">{ingredient}</td>
                      <td className="ingredient-delete-box">
                        <button
                          type="button"
                          className="secondary-button ingredient-delete-button"
                          onClick={() => handleDeleteIngredient(ingredient)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              : null}

            {ingredients && ingredients.length === 0 ? (
              <h3 className="text-center no-ingredients">
                No Ingredients Added Yet
              </h3>
            ) : null}
          </tbody>
        </table>
      </div>
      {/* hiển thị để nhập nguyên liệu */}
      <div className="ingredient-form">
        <label className="ingredient-label">
          Ingredient:
          <input
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)} // mỗi khi input thay đổi nó đã tự chạy hàm setState mới cho state ingredientName
            onKeyPress={handleAddIngredient} // ngắn chặn việc gõ nhầm enter sẽ bị gửi data đi luôn nên sẽ lấy sự kiện nhấn phím
            // để nhỡ có nhấn thì sẽ câu lệnh để né việc gửi data đi
            className="input-text"
            placeholder="ex. 1 cup of sugar"
          />
        </label>
        <button
          type="button"
          className="primary-button add-ingredient-button"
          onClick={handleAddIngredient}
        >
          Add Ingredient
        </button>
      </div>
      {/* khu vực chứa các btn chức năng. Button submit để gửi dữ liệu từ form  */}
      <div className="action-buttons">
        <button type="submit" className="primary-button action-button">
          {existingRecipe ? "Update Recipe" : "Create Recipe"}
        </button>

        {existingRecipe ? (
          <>
            <button
              onClick={handleEditRecipeCancel}
              type="button"
              className="primary-button action-button"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                handleDeleteRecipe(existingRecipe.id);
                setExistingRecipe(null);
              }}
              type="button"
              className="primary-button action-button"
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}

export default AddEditRecipeForm;
