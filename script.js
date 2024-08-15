document.getElementById("calculate-button").addEventListener("click", function (event) {
    event.preventDefault();

    const age = parseInt(document.getElementById("age").value);
    const gender = document.getElementById("gender").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const heightFeet = parseInt(document.getElementById("height-feet").value);
    const heightInches = parseInt(document.getElementById("height-inches").value);
    const activityFactor = parseFloat(document.getElementById("activity-factor").value);
    const stressFactor = parseFloat(document.getElementById("stress-factor").value);
    const carbs = parseFloat(document.getElementById("carbs").value);
    const protein = parseFloat(document.getElementById("protein").value);
    const fat = parseFloat(document.getElementById("fat").value);

    // Check if any input fields are empty (except stress factor which is optional)
    if (isNaN(age) || isNaN(weight) || isNaN(heightFeet) || isNaN(heightInches) ||
        isNaN(activityFactor) || isNaN(carbs) || isNaN(protein) || isNaN(fat) ||
        !gender) {
        alert("Please fill out all fields.");
        return;
    }

    // Check if values are within acceptable ranges
    if (age < 1 || age > 150 || weight < 0 || weight > 300 || 
        heightFeet < 1 || heightFeet > 8 || heightInches < 0 || heightInches > 11 ||
        activityFactor < 1.0 || activityFactor > 2.0 ||
        carbs < 45 || carbs > 65 || protein < 10 || protein > 35 || fat < 20 || fat > 35) {
        alert("Please ensure all input values are within the specified ranges.");
        return;
    }
    
    if (carbs + protein + fat !== 100) {
        alert("The sum of carbs, protein, and fat must be exactly 100.");
        return;
    }

    const height = [heightFeet, heightInches];

    const bmi = calculateBMI(weight, height);
    const ibw = calculateIBW(height, gender);
    const bmr = calculateBMR(ibw, height, age, gender); // Use IBW instead of actual weight
    let tee = calculateTEE(bmr, activityFactor);

    // Apply stress factor if provided
    if (!isNaN(stressFactor)) {
        tee *= stressFactor;
    }

    const amdr = calculateAMDR(tee, carbs, protein, fat);

    displayResults(bmi, ibw, bmr, tee, amdr);
});

function calculateBMI(weight, height) {
    const heightInMeters = (height[0] * 12 + height[1]) * 0.0254;
    return weight / (heightInMeters ** 2);
}

function calculateIBW(height, gender) {
    const heightInInches = (height[0] * 12) + height[1];
    if (gender === "male") {
        if (height[0] < 5) {
            const remainingInches = (5 * 12) - heightInInches;
            return (106 - (6 * remainingInches)) / 2.2;
        } else {
            const additionalInches = heightInInches - (5 * 12);
            return (106 + (additionalInches * 6)) / 2.2;
        }
    } else {
        if (height[0] < 5) {
            const remainingInches = (5 * 12) - heightInInches;
            return (100 - (5 * remainingInches)) / 2.2;
        } else {
            const additionalInches = heightInInches - (5 * 12);
            return (100 + (additionalInches * 5)) / 2.2;
        }
    }
}

function calculateBMR(weight, height, age, gender) {
    const heightInCentimeters = (height[0] * 12 + height[1]) * 2.54;
    if (gender === "male") {
        return 66.5 + (13.75 * weight) + (5.003 * heightInCentimeters) - (6.75 * age);
    } else {
        return 655.1 + (9.563 * weight) + (1.850 * heightInCentimeters) - (4.676 * age);
    }
}

function calculateTEE(bmr, activityFactor) {
    return bmr * activityFactor;
}

function calculateAMDR(tee, carbs, protein, fat) {
    return {
        "Carbohydrates": ((carbs / 100) * tee) / 4,
        "Protein": ((protein / 100) * tee) / 4,
        "Fat": ((fat / 100) * tee) / 9
    };
}

function displayResults(bmi, ibw, bmr, tee, amdr) {
    const outputSection = document.getElementById("output");
    outputSection.innerHTML = `
        <p><strong>BMI:</strong> ${Math.round(bmi)} kg/m<sup>2</sup></p>
        <p><strong>IBW:</strong> ${Math.round(ibw)} kg</p>
        <p><strong>BMR:</strong> ${Math.round(bmr)} kcal</p>
        <p><strong>TEE:</strong> ${Math.round(tee)} kcal</p>
        <h3>AMDR:</h3>
        <p><strong>Carbohydrates:</strong> ${Math.round(amdr.Carbohydrates)} grams</p>
        <p><strong>Protein:</strong> ${Math.round(amdr.Protein)} grams</p>
        <p><strong>Fat:</strong> ${Math.round(amdr.Fat)} grams</p>
    `;
}
