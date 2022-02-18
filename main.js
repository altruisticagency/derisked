(function () {
    const mainForm = document.querySelector('#mainForm');

    const outputSunburnAfter = document.querySelector('#outputSunburnAfter');
    const outputAlternativeProjection = document.querySelector('#outputAlternativeProjection');
    const outputPercentPopulation = document.querySelector('#outputPercentPopulation');
    const outputOptimal = document.querySelector('#outputOptimal');

    const minutesUntilSunburn = {
        '1': {
            2: 64.0,
            3: 45.3,
            4: 34.4,
            5: 26.2,
            6: 22.0,
            7: 20.0,
            8: 17.2,
            9: 15.0,
            10: 12.0,
            11: 11.0
        },
        '2': {
            2: 82.5,
            3: 57.0,
            4: 42.3,
            5: 34.9,
            6: 29.1,
            7: 25.3,
            8: 22.1,
            9: 20.0,
            10: 18.2,
            11: 17.3
        },
        '3': {
            2: 117.0,
            3: 79.1,
            4: 59.4,
            5: 46.1,
            6: 39.5,
            7: 35.2,
            8: 30.1,
            9: 25.0,
            10: 23.1,
            11: 21.4
        },
        '4': {
            2: 150.0,
            3: 101.9,
            4: 75.5,
            5: 60.2,
            6: 50.1,
            7: 42.7,
            8: 39.2,
            9: 33.8,
            10: 30.0,
            11: 27.4
        }
    };

    const optimalMap = {
        '1': 0.7,
        '2': 1,
        '3': 1.5,
        '4': 2,
        '5': 6,
        '6': 9
    };

    const bodyMap = {
        1: 20,
        2: 7.7,
        3: 4.3,
        4: 3,
        5: 2.3,
        6: 1.9,
        7: 1.5,
        8: 1.3,
        9: 1.1,
        10: 1,
        11: 0.9,
        12: 0.83,
        13: 0.8,
        14: 0.71,
        15: 0.67
    };

    const alternativeProjectionMap = {
        '1': 2.5,
        '2': 3,
        '3': 4,
        '4': 5,
        '5': 8,
        '6': 15
    };

    function calculateSunburn () {
        console.log('Calculating…');

        const skinType = document.querySelector('#inputSkinType').value;
        const UVIndex = Number(document.querySelector('#inputUVIndex').value);
        const timeInSun = Number(document.querySelector('#inputTimeInSun').value);
        const SPF = Number(document.querySelector('#inputSPF').value);
        const SPFQuantity = Number(document.querySelector('#inputSPFQuantity').value);
        const sweating = document.querySelector('#inputSweating').value;
        const exposedSkin = Number(document.querySelector('#inputExposedSkin').value);

        const sweatingFactor = sweating === 'yes' ? 1.0 : 1 - (1 - 50 / 65) / 120 * timeInSun / 2;
        const sunscreenEffect = SPF * SPFQuantity * sweatingFactor;
        const sunscreenFactor = sunscreenEffect > 1 ? sunscreenEffect : 1;

        const sunburnAfter = minutesUntilSunburn[skinType] ? Math.round(minutesUntilSunburn[skinType][UVIndex] * sunscreenFactor) : 0;

        const alternativeProjection = Math.round(200 / (3 * UVIndex) * alternativeProjectionMap[skinType] * sunscreenFactor);

        const IUV = 15.1 * UVIndex + 35.5;

        const radiationDose = IUV ** (4 / 3) * (timeInSun * 60) / 10000;

        const firstDegreeBurnProbits = {
            '1': -10.8 + 6.95 * Math.log10(radiationDose),
            '2': -11.7 + 6.95 * Math.log10(radiationDose),
            '3': -12.3 + 6.95 * Math.log10(radiationDose),
            '4': -13.2 + 6.95 * Math.log10(radiationDose)
        };

        const desiredProbit = firstDegreeBurnProbits[skinType];

        const percentPopulation = parseFloat(-3.25 * desiredProbit ** 3 + 48.8 * desiredProbit ** 2 - 207 * desiredProbit + 270).toFixed(1);

        const optimal = Math.round(bodyMap[UVIndex] / exposedSkin * optimalMap[skinType] * sunscreenFactor);

        outputSunburnAfter.innerText = sunburnAfter === 0 ? 'Calculation of this value went outside accepted bounds; this outcome has low accuracy.' : sunburnAfter + ' minutes';
        outputAlternativeProjection.innerText = `${alternativeProjection} minutes`;
        outputPercentPopulation.innerText = `${percentPopulation} %`;
        outputOptimal.innerText = `${optimal} minutes`;
    }

    mainForm.addEventListener('change', calculateSunburn);

    calculateSunburn();
})();
