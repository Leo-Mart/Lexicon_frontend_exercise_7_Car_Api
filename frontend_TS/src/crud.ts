const API_URL = "https://localhost:7253/api/cars";

interface Car {
  [key: string]: string | number | undefined;
  id?: number;
  brand: string;
  model: string;
  year: number;
  color: string;
}

const carKeys: (keyof Car)[] = ["id", "brand", "model", "year", "color"];

// ==========================================
// 🟢 READ (GET) - Hämta och visa alla bilar
// ==========================================
export const fetchCars = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Fel vid hämtning: ${response.status}`);
    }

    const cars = await response.json();

    const carList = document.querySelector<HTMLDivElement>("#car-list")!;

    // Töm listan innan vi ritar ut på nytt
    carList.innerHTML = "";

    if (cars.length === 0) {
      carList.innerHTML = "<p>Det finns inga bilar i databasen.</p>";
      return;
    }

    // Loopa igenom bilarna och bygg HTML för varje kort
    cars.forEach((car: Car) => {
      const card = document.createElement("div");
      card.className = "car-card";
      card.innerHTML = `
                        <div>
                            <strong>${car.brand} ${car.model}</strong> (${car.year}) <br>
                            <span style="font-size: 0.9rem; color: #777;">Färg: ${car.color}</span>
                        </div>
                        <div class="btn-group">
                            <button id="edit-btn-${car.id!}" class="outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Redigera</button>
                            <button id="delete-btn-${car.id!}" class="outline contrast" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Ta bort</button>
                        </div>
                    `;

      carList.appendChild(card);
      const deleteBtn = document.querySelector(`#delete-btn-${car.id!}`);
      const editBtn = document.querySelector(`#edit-btn-${car.id!}`);

      editBtn!.addEventListener("click", () => prepareEdit(car));

      deleteBtn!.addEventListener(
        "click",
        async () => await deleteCar(+car.id!),
      );
    });
  } catch (error) {
    const carList = document.querySelector<HTMLDivElement>("#car-list")!;
    console.error("Fel:", error);
    carList.innerHTML = `<p style="color: red;">Kunde inte hämta bilar. Körs ditt API på ${API_URL}?</p>`;
  }
};
// ==========================================
// 🟢 POST - Skapa ny bil och spara i DB
// ==========================================

export const saveCar = async (e: Event) => {
  e.preventDefault();

  const carForm = document.querySelector<HTMLFormElement>("#car-form")!;
  const formData = new FormData(carForm);
  const payload: Car = {
    brand: "",
    model: "",
    year: 0,
    color: "",
  };

  payload.brand = formData.get("brand")!.toString();
  payload.model = formData.get("model")!.toString();
  payload.year = Number(formData.get("year")!.toString());
  payload.color = formData.get("color")!.toString();

  const respAllCars = await fetch(API_URL);

  if (!respAllCars.ok) {
    throw new Error(`Fel vid hämtning: ${respAllCars.status}`);
  }

  const cars = await respAllCars.json();

  const carList = document.querySelector<HTMLDivElement>("#car-list")!;
  const carIdInput = document.querySelector<HTMLInputElement>("#car-id")!;

  if (!cars.find((c: Car) => c.id === parseInt(carIdInput.value))) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Kunda inte spara bil: ${response.status}`);
      }

      const car = await response.json();
      carForm.reset();
    } catch (error) {
      console.error("Fel:", error);
      carList.innerHTML = `<p style="color: red;">Kunde inte spara bil</p>`;
    } finally {
      fetchCars();
    }
  } else {
    try {
      const formData = new FormData(carForm);

      const payload: Car = {
        brand: "",
        model: "",
        year: 0,
        color: "",
      };

      payload.brand = formData.get("brand")!.toString();
      payload.model = formData.get("model")!.toString();
      payload.year = Number(formData.get("year")!.toString());
      payload.color = formData.get("color")!.toString();

      const response = await fetch(`${API_URL}/${carIdInput.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Kunda inte uppdatera bil: ${response.status}`);
      }
      carForm.reset();
    } catch (error) {
      console.error("Fel:", error);
      carList.innerHTML = `<p style="color: red;">Kunde inte uppdatera bil</p>`;
    } finally {
      fetchCars();
    }
  }
};

// ==========================================
// 🟢 DELETE - Ta bort en bil
// ==========================================

export const deleteCar = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Kunda inte ta bort bil: ${response.status}`);
    }

    fetchCars();
  } catch (error) {
    const carList = document.querySelector<HTMLDivElement>("#car-list")!;
    console.error("Fel:", error);
    carList.innerHTML = `<p style="color: red;">Kunde inte ta bort bil</p>`;
  }
};

// ==========================================
// 🟢 UPDATE (PUT) - Updatera en bil
// ==========================================

export const prepareEdit = async (car: Car) => {
  console.log("hello?");
  const carIdInput = document.querySelector<HTMLInputElement>("#car-id")!;
  carIdInput.value = String(car.id!);

  let brandInput = document.querySelector<HTMLInputElement>("#brand");
  let modelInput = document.querySelector<HTMLInputElement>("#model");
  let yearInput = document.querySelector<HTMLInputElement>("#year");
  let colorInput = document.querySelector<HTMLInputElement>("#color");

  brandInput!.value = car.brand;
  modelInput!.value = car.model;
  yearInput!.value = String(car.year);
  colorInput!.value = car.color;
};

// save for later
// const payload: Partial<Car> = {};
//
// formData.forEach((value, key) => {
//   if (value instanceof File) return;
//
//   if (!carKeys.includes(key as keyof Car)) return;
//
//   if (key === "year") {
//     payload.year = Number(value);
//     return;
//   }
//
//   if (key === "id") {
//     payload.id = Number(value);
//     return;
//   }
//
//   (payload as Record<string, string | number | undefined>)[key] = value;
// });
