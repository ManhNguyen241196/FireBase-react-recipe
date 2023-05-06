import { useEffect, useState } from "react";
import FirebaseAuthService from "./FireBaseAuth";

import LoginForm from "./components/LoginForm";
import FirebaseFirestoreService from "./FirebaseFirestoreService";

import "./App.css";
import AddEditRecipeForm from "./components/AddEditForm";
import EditButton from "./components/EditButton";

function App() {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [recipeValue, setRecipeValue] = useState(null);
  //loading spinner
  const [isLoading, setIsloading] = useState(false);

  // filter category
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    //useeffect nay làm nhiệm vụ chính để fetch data từ data base.
    //nó có thể là lấy all data đơn thuần nhưng cũng có thể lấy bằng cách lọc data.
    //và thay vì loadall data về rồi lọc lấy cái cần thì firebase có thể cho phepos lọc
    //trực tiếp trên cơ sở dữ liệu nên lấy dữ liệu về sẽ nhanh hơn.
    setIsloading(true);
    fetchRecipes() //kết quả function này là 1 promise
      .then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      })
      .catch((error) => {
        console.log(error.message);
        throw error;
      })
      .finally(() => {
        setIsloading(false);
      });
  }, [user, categoryFilter]);

  // Xác định xem có user đã login thành công hay chưa để set state mới. Nên nó pahir đứng đầu
  // tất nhiên vẫn sau định nghĩa biến và useEffect(). useEffect thuwofng sau const để đảm bảo
  // code k bị lỗi.
  FirebaseAuthService.subscribeToAuthChanges(setUser);

  //------------------// Các hàm method tương tác

  async function fetchRecipes() {
    let queries = []; // định nghĩa truy vấn data là 1 array

    // truy vấn với điều kiện lọc có đầu vào cụ thể
    if (categoryFilter) {
      queries.push({
        field: "category",
        condition: "==",
        value: categoryFilter,
      });
    }

    // truy vấn với điều kiện là xác nhận có user login thành công hay không
    if (!user) {
      queries.push({
        // truy vấn thông qua 3 thông tin là vùng truy vấn, điều kiện truy vấn, và giá trị
        // đem ra truy vấn.
        field: "isPublished",
        condition: "==",
        value: true,
      });
    }

    let inforQuery = {
      collection: "test",
      queries: queries,
    };

    let fetchedRecipes = [];
    try {
      const response = await FirebaseFirestoreService.readDocument(inforQuery);

      const newRecipes = response.docs.map((recipeDoc) => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);

        return { ...data, id };
      });

      fetchedRecipes = [...newRecipes];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
    return fetchedRecipes;
  }

  async function handleFetchRecipe() {
    try {
      const fetchedRecipes = await fetchRecipes();
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  //-------------------edit 1 recipe cụ thể bằng cách find id của array recipes được get và set và state.
  async function handleUpdateRecipe(newRecipe, recipeId) {
    try {
      await FirebaseFirestoreService.updateDocument(
        //đây là bước cuối cùng của quá trình update
        "test",
        recipeId,
        newRecipe
      );
      handleFetchRecipe();

      alert("UPDATE thanh cong recipes ");
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  function getRecipeSelected(dataValue) {
    setRecipeValue(dataValue);
  }

  // function handleEditRecipeCancel() {
  //   setRecipeValue(null);
  // }

  //cac function xử lí dữ liệu hiển thị cho đẹp
  function lookupCategoryLabel(categoryKey) {
    //định dạng lại các đề mục
    const categories = {
      breadsSandwichesAndPizza: "Breads, Sandwiches, and Pizza",
      eggsAndBreakfast: "Eggs & Breakfast",
      dessertsAndBakedGoods: "Desserts & Baked Goods",
      fishAndSeafood: "Fish & Seafood",
      vegetables: "Vegetables",
    };
    const label = categories[categoryKey];
    return label;
  }
  function formatDate(date) {
    const splitdate = date.toISOString().split("T")[0];
    return splitdate;
  }

  async function handleDeleteRecipe(recipeId) {
    const windowConfirm = window.confirm(
      "co chac chan muon xoa recipe nay khong?"
    );
    if (windowConfirm) {
      try {
        const response = await FirebaseFirestoreService.deleteDocument(
          "test",
          recipeId
        );
        handleFetchRecipe();
      } catch (error) {
        alert(error.message);
      }
    }
  }

  async function handleAddRecipe(newRecipe) {
    try {
      const response = await FirebaseFirestoreService.creatDocument(
        "test",
        newRecipe
      );

      //sau khi add thì sẽ chạy hàm get luôn dữ liệu
      handleFetchRecipe();

      alert("creat thanh cong recipe ");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user} />
      </div>

      <div className="main">
        {/* <div className="row filters">
          <label className="recipe-label input-label">
            Category:
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select"
              required
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
        </div> */}
        <div className="recipe-list-box">
          {isLoading ? (
            <div>
              <div>loading...</div>
              <div className="logs"></div>
            </div>
          ) : null}

          {!isLoading && recipes && recipes.length === 0 ? (
            <div className="no-recipes">No recipes</div>
          ) : null}

          {!isLoading && recipes && recipes.length > 0 ? (
            <div className="recipe-list">
              {recipes.map((recipe) => {
                return (
                  <div className="recipe-card" key={recipe.id}>
                    {recipe.isPublished === false ? (
                      <div className="unpublished">UNPUBLISHED</div>
                    ) : null}

                    {recipe.imageUrl ? (
                      <div className="recipe-image-box">
                        <img
                          width="200"
                          height="200"
                          src={recipe.imageUrl}
                          alt="anh pizza"
                          loading="lazy"
                        ></img>
                      </div>
                    ) : null}

                    <div className="recipe-name">{recipe.name}</div>
                    <div className="recipe-field">
                      Category: {lookupCategoryLabel(recipe.category)}
                    </div>
                    <div className="recipe-field">
                      Publish Date: {formatDate(recipe.publishDate)}
                    </div>
                    {user ? (
                      <EditButton
                        getRecipeSelected={getRecipeSelected}
                        allRecipes={recipes}
                        recipe={recipe}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      {console.log(recipeValue)}
      {user && (
        <div className="main">
          {/* truyen bien sang component con: truyền 1 biến giá trị để xác định recipe đang edit là gì
          và truyền hàm add new recipe mới vào database.và 1 hàm edit database. Component con kia có cả
          2 chức năng đó*/}
          <AddEditRecipeForm
            existingRecipeTest={recipeValue}
            handleAddRecipe={handleAddRecipe}
            handleUpdateRecipe={handleUpdateRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
          />
        </div>
      )}
    </div>
  );
}

export default App;
