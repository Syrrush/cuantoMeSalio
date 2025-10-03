import { useState, useEffect, useRef } from "react";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [form, setForm] = useState({
    name: "",
    cost: "",
    quantityBought: "",
    quantityUsed: "",
  });
  const [title, setTitle] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editIngredientIndex, setEditIngredientIndex] = useState(null);
  const [profitPercent, setProfitPercent] = useState("");

  // 🔥 Ref para el input de Ingrediente
  const ingredientInputRef = useRef(null);

  // Cargar recetas desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) setRecipes(JSON.parse(saved));
  }, []);

  // Guardar recetas en localStorage
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addOrUpdateIngredient = () => {
    if (!form.name || !form.cost || !form.quantityBought || !form.quantityUsed)
      return;

    const newIngredient = {
      ...form,
      cost: parseFloat(form.cost),
      quantityBought: parseFloat(form.quantityBought),
      quantityUsed: parseFloat(form.quantityUsed),
    };

    let updatedIngredients = [...currentRecipe.ingredients];

    if (editIngredientIndex !== null) {
      // actualizar ingrediente existente
      updatedIngredients[editIngredientIndex] = newIngredient;
      setEditIngredientIndex(null);
    } else {
      // agregar nuevo
      updatedIngredients.push(newIngredient);
    }

    setCurrentRecipe({
      ...currentRecipe,
      ingredients: updatedIngredients,
    });

    setForm({ name: "", cost: "", quantityBought: "", quantityUsed: "" });

    // 🔥 Volver a enfocar el input de Ingrediente
    if (ingredientInputRef.current) {
      ingredientInputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addOrUpdateIngredient();
    }
  };

  const editIngredient = (index) => {
    const ing = currentRecipe.ingredients[index];
    setForm({
      name: ing.name,
      cost: ing.cost,
      quantityBought: ing.quantityBought,
      quantityUsed: ing.quantityUsed,
    });
    setEditIngredientIndex(index);

    // 🔥 también ponemos el foco al editar
    if (ingredientInputRef.current) {
      ingredientInputRef.current.focus();
    }
  };

  const finishRecipe = () => {
    if (!title || !currentRecipe) return;

    const recipeWithProfit = {
      ...currentRecipe,
      title,
      profitPercent, // 🔥 guardamos el porcentaje
    };

    if (editIndex !== null) {
      // Editar receta existente
      const updatedRecipes = [...recipes];
      updatedRecipes[editIndex] = recipeWithProfit;
      setRecipes(updatedRecipes);
    } else {
      // Nueva receta
      setRecipes([...recipes, recipeWithProfit]);
    }

    setTitle("");
    setCurrentRecipe(null);
    setEditIndex(null);
    setProfitPercent("");
  };

  const startNewRecipe = () => {
    setCurrentRecipe({ ingredients: [] });
    setTitle("");
    setEditIndex(null);
    setProfitPercent("");

    // 🔥 dar foco al ingrediente al empezar nueva receta
    setTimeout(() => {
      if (ingredientInputRef.current) {
        ingredientInputRef.current.focus();
      }
    }, 0);
  };

  const editRecipe = (index) => {
    setCurrentRecipe(recipes[index]);
    setTitle(recipes[index].title);
    setEditIndex(index);
    setProfitPercent(recipes[index].profitPercent || "");
  };

  const totalCost = (ingredients) =>
    ingredients.reduce((acc, ing) => {
      const unitCost = ing.cost / ing.quantityBought;
      return acc + unitCost * ing.quantityUsed;
    }, 0);

  const calculateSellingPrice = (cost) => {
    if (!profitPercent || isNaN(profitPercent)) return cost;
    return cost + (cost * profitPercent) / 100;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        🍳 Cuánto me sale? 🤑
      </h1>

      {!currentRecipe ? (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mis Recetas</h2>
          {recipes.length === 0 && (
            <p className="text-gray-500 text-center mb-4">
              No tienes recetas aún
            </p>
          )}
          <ul className="space-y-3">
            {recipes.map((recipe, idx) => (
              <li
                key={idx}
                className="border rounded-lg p-3 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                onClick={() => editRecipe(idx)}
              >
                <span className="font-medium">{recipe.title}</span>
                <div className="flex flex-col text-right">
                  <span className="font-bold text-blue-600">
                    ${totalCost(recipe.ingredients).toFixed(2)}
                  </span>
                  {recipe.profitPercent && (
                    <span className="text-sm text-gray-500">
                      +{recipe.profitPercent}%
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={startNewRecipe}
            className="mt-6 w-full bg-blue-500 text-white py-3 text-lg rounded-lg hover:bg-blue-600"
          >
            ➕ Nueva Receta
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editIndex !== null ? "Editar Receta" : "Nueva Receta"}
          </h2>

          <input
            type="text"
            placeholder="Título de la receta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 w-full rounded mb-4 text-lg"
          />

          <div className="grid gap-3 mb-4">
            <input
              ref={ingredientInputRef} // 👈 ref en el input de ingrediente
              type="text"
              name="name"
              placeholder="Ingrediente"
              value={form.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="border p-3 rounded text-lg w-full"
            />
            <input
              type="number"
              name="cost"
              placeholder="Costo total"
              value={form.cost}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="border p-3 rounded text-lg w-full"
            />
            <div className="flex flex-col">
  <label className="text-sm font-medium text-gray-300 mb-1">
    Cantidad comprada <span className="text-gray-400">(en gramos, ml o unidades)</span>
  </label>
  <input
              type="number"
              name="quantityUsed"
              placeholder="Ej: 1000(1 kg /litro) o 30 (maple huevos)"
              value={form.quantityUsed}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border rounded"
            />
</div>
            <div className="flex flex-col">
  <label className="text-sm font-medium text-gray-300 mb-1">
    Cantidad usada en la receta <span className="text-gray-400">(en gramos, ml o unidades)</span>
  </label>
  <input
              type="number"
              name="quantityUsed"
              placeholder="Ej: 300gr/ml o 6u (media docena de huevos)"
              value={form.quantityUsed}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border rounded"
            />
</div>
            
            <button
              onClick={addOrUpdateIngredient}
              className="bg-green-500 text-white py-3 text-lg rounded-lg hover:bg-green-600"
            >
              {editIngredientIndex !== null
                ? "✏️ Actualizar Ingrediente"
                : "➕ Agregar Ingrediente"}
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-2">Ingredientes</h3>
          <ul className="space-y-2 mb-4">
            {currentRecipe.ingredients.map((ing, idx) => {
              const unitCost = ing.cost / ing.quantityBought;
              const usedCost = unitCost * ing.quantityUsed;
              return (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>
                    {ing.name} ({ing.quantityUsed}/{ing.quantityBought})
                  </span>
                  <div className="flex items-center gap-2">
                    <span>${usedCost.toFixed(2)}</span>
                    <button
                      className="text-blue-500 hover:underline text-sm"
                      onClick={() => editIngredient(idx)}
                    >
                      ✏️
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Total y margen */}
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total:</span>
            <span>${totalCost(currentRecipe.ingredients).toFixed(2)}</span>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              ¿Cuánto % querés ganar?
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[25, 50].map((p) => (
                <button
                  key={p}
                  onClick={() => setProfitPercent(p)}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  {p}%
                </button>
              ))}
              <button
                onClick={() => setProfitPercent(100)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                El Doble (x2)
              </button>
              <button
                onClick={() => setProfitPercent(200)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
              >
                El Triple (x3)
              </button>
            </div>
            <input
              type="number"
              placeholder="Porcentaje personalizado"
              value={profitPercent}
              onChange={(e) => setProfitPercent(parseFloat(e.target.value))}
              className="border p-3 rounded text-lg w-full"
            />
          </div>

          <div className="flex flex-col gap-3 text-lg font-bold mb-6 bg-gray-900/50 border border-gray-700 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Precio de venta:</span>
              <span className="text-green-400">
                $
                {calculateSellingPrice(
                  totalCost(currentRecipe.ingredients)
                ).toFixed(2)}{" "}
                🤑
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estarías ganando:</span>
              <span className="text-yellow-300">
                $
                {(
                  calculateSellingPrice(totalCost(currentRecipe.ingredients)) -
                  totalCost(currentRecipe.ingredients)
                ).toFixed(2)}{" "}
                💰
              </span>
            </div>
          </div>

          <button
            onClick={finishRecipe}
            className="w-full bg-blue-500 text-white py-3 text-lg rounded-lg hover:bg-blue-600"
          >
            ✅ Guardar Receta
          </button>
        </div>
      )}
    </div>
  );
}
