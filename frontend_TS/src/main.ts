import { deleteCar, fetchCars, prepareEdit, saveCar } from "./crud";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <header>
      <h1>My Cars</h1>
      <p>Enkel frontend som pratar med vårt Minimal API</p>
    </header>

    <main>
      <section id="form-section">
        <h3 id="form-title">Lägg till ny bil</h3>
        <form id="car-form">
          <input type="hidden" id="car-id" />

          <div class="grid">
            <label>
              Märke
              <input
                type="text"
                id="brand"
                name="brand"
                placeholder="t.ex. Volvo"
                required
              />
            </label>
            <label>
              Modell
              <input
                type="text"
                id="model"
                name="model"
                placeholder="t.ex. 240 Turbo"
                required
              />
            </label>
          </div>
          <div class="grid">
            <label>
              Årsmodell
              <input
                type="number"
                id="year"
                name="year"
                placeholder="t.ex. 1983"
                required
              />
            </label>
            <label>
              Färg
              <input
                type="text"
                id="color"
                name="color"
                placeholder="t.ex. Silver"
                required
              />
            </label>
          </div>
          <div style="display: flex; gap: 1rem">
            <button type="submit" id="submit-btn" style="flex: 3">
              Spara bil
            </button>
            <button
              type="button"
              id="cancel-btn"
              class="secondary"
              style="flex: 1; display: none"
            >
              Avbryt
            </button>
          </div>
        </form>
      </section>

      <hr />

      <section>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <h3>Våra bilar i databasen</h3>
          <button id="load-btn" class="secondary" style="width: auto">
            Hämta bilar
          </button>
        </div>

        <div id="car-list">
          <p>Klicka på knappen för att ladda in bilar...</p>
        </div>
      </section>
    </main>
`;

const loadBtn = document.querySelector<HTMLButtonElement>("#load-btn")!;
const carForm = document.querySelector<HTMLFormElement>("#car-form")!;

loadBtn.addEventListener("click", fetchCars);
carForm.addEventListener("submit", saveCar);
