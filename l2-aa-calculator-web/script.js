// Official rates
const OFFICIAL_RATES = {
    red: 10,
    green: 5,
    blue: 3,
};

function getNumberValue(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const v = parseFloat(el.value);
    if (isNaN(v)) return 0;
    return v;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function updateRatesFromProfile() {
    const category = document.getElementById("category").value;

    if (category === "Official") {
        // Reset custom fields visually
        document.getElementById("rate-blue-custom").value = OFFICIAL_RATES.blue;
        document.getElementById("rate-green-custom").value = OFFICIAL_RATES.green;
        document.getElementById("rate-red-custom").value = OFFICIAL_RATES.red;

        // Update visual AA / Stone labels
        setText("rate-blue", OFFICIAL_RATES.blue);
        setText("rate-green", OFFICIAL_RATES.green);
        setText("rate-red", OFFICIAL_RATES.red);

        // Disable custom fields
        setCustomInputsEnabled(false);
    } else {
        // Custom server selected
        setCustomInputsEnabled(true);
        // Use custom fields as current rates
        const blue = getNumberValue("rate-blue-custom");
        const green = getNumberValue("rate-green-custom");
        const red = getNumberValue("rate-red-custom");

        setText("rate-blue", blue);
        setText("rate-green", green);
        setText("rate-red", red);
    }
}

function setCustomInputsEnabled(enabled) {
    const ids = ["rate-blue-custom", "rate-green-custom", "rate-red-custom"];
    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.disabled = !enabled;
        el.classList.toggle("disabled-input", !enabled);
    });
}

function calculate() {
    const category = document.getElementById("category").value;

    let rRate, gRate, bRate;

    if (category === "Official") {
        rRate = OFFICIAL_RATES.red;
        gRate = OFFICIAL_RATES.green;
        bRate = OFFICIAL_RATES.blue;
    } else {
        // Custom Server
        rRate = getNumberValue("rate-red-custom");
        gRate = getNumberValue("rate-green-custom");
        bRate = getNumberValue("rate-blue-custom");
    }

    // Update AA / Stone labels visually
    setText("rate-red", rRate);
    setText("rate-green", gRate);
    setText("rate-blue", bRate);

    const qRed = getNumberValue("qty-red");
    const qGreen = getNumberValue("qty-green");
    const qBlue = getNumberValue("qty-blue");

    const totalRed = qRed * rRate;
    const totalGreen = qGreen * gRate;
    const totalBlue = qBlue * bRate;
    const totalAA = totalRed + totalGreen + totalBlue;

    setText("total-red", totalRed);
    setText("total-green", totalGreen);
    setText("total-blue", totalBlue);
    setText("total-aa", totalAA);
}

function resetAll() {
    document.getElementById("qty-red").value = 0;
    document.getElementById("qty-green").value = 0;
    document.getElementById("qty-blue").value = 0;

    setText("total-red", 0);
    setText("total-green", 0);
    setText("total-blue", 0);
    setText("total-aa", 0);

    // Reset to Official
    document.getElementById("category").value = "Official";
    updateRatesFromProfile();
}

function setupEvents() {
    document
        .getElementById("category")
        .addEventListener("change", () => updateRatesFromProfile());

    document.getElementById("btn-calc").addEventListener("click", calculate);
    document.getElementById("btn-reset").addEventListener("click", resetAll);

    // Live update AA / Stone labels when editing custom rates
    ["rate-blue-custom", "rate-green-custom", "rate-red-custom"].forEach((id) => {
        const el = document.getElementById(id);
        el.addEventListener("input", () => {
            if (document.getElementById("category").value === "Custom") {
                const blue = getNumberValue("rate-blue-custom");
                const green = getNumberValue("rate-green-custom");
                const red = getNumberValue("rate-red-custom");

                setText("rate-blue", blue);
                setText("rate-green", green);
                setText("rate-red", red);
            }
        });
    });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    updateRatesFromProfile(); // set Official by default
    setupEvents();
});
