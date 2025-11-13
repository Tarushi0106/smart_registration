class DynamicFields {
    constructor() {
        this.countryStateMap = {
            us: ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
            uk: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
            ca: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
            au: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
            in: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh']
        };

        this.stateCityMap = {
            'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
            'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany'],
            'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio'],
            'England': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
            'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
            'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'],
            'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
            'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
            'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
            'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
            'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore']
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const countrySelect = document.getElementById('country');
        const stateSelect = document.getElementById('state');
        const citySelect = document.getElementById('city');

        countrySelect.addEventListener('change', () => this.updateStates());
        stateSelect.addEventListener('change', () => this.updateCities());
    }

    updateStates() {
        const country = document.getElementById('country').value;
        const stateSelect = document.getElementById('state');
        const citySelect = document.getElementById('city');

        // Clear existing options
        stateSelect.innerHTML = '<option value="">Select State</option>';
        citySelect.innerHTML = '<option value="">Select City</option>';

        if (country && this.countryStateMap[country]) {
            stateSelect.disabled = false;
            this.countryStateMap[country].forEach(state => {
                const option = document.createElement('option');
                option.value = state.toLowerCase().replace(/\s+/g, '_');
                option.textContent = state;
                stateSelect.appendChild(option);
            });
        } else {
            stateSelect.disabled = true;
            citySelect.disabled = true;
        }
    }

    updateCities() {
        const state = document.getElementById('state');
        const stateText = state.options[state.selectedIndex].text;
        const citySelect = document.getElementById('city');

        // Clear existing options
        citySelect.innerHTML = '<option value="">Select City</option>';

        if (stateText && this.stateCityMap[stateText]) {
            citySelect.disabled = false;
            this.stateCityMap[stateText].forEach(city => {
                const option = document.createElement('option');
                option.value = city.toLowerCase().replace(/\s+/g, '_');
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } else {
            citySelect.disabled = true;
        }
    }
}

// Initialize dynamic fields when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DynamicFields();
});