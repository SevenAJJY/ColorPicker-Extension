const colorPickerBtn = document.querySelector('#color-picker');
const colorList = document.querySelector('.all-colors');
const clearAll = document.querySelector('.clear-all');
const pickedColors = JSON.parse(localStorage.getItem('picked-colors') || "[]");
const pickedColorContainer = document.querySelector('.picked-colors');
const darkLightMode = document.querySelector('.dark-mode i');


const copyColor = (element) => {
    navigator.clipboard.writeText(element.dataset.color);
    element.innerText = 'Copied!';
    setTimeout(() => element.innerText = element.dataset.color, 2000);
}

const showColors = () => {
    if (!pickedColors.length) return;

    showColorsChosen(pickedColors);

    pickedColorContainer.classList.remove('hide');

    document.querySelectorAll('.color').forEach((li) => {
        li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild))
    });
}
showColors();

function showColorsChosen(allColors) {
    colorList.innerHTML = "";
    for (let i = 0; i < allColors.length; i++) {
        let liTag = document.createElement('li');
        liTag.className = "color";
        let spanRect = document.createElement('span');
        spanRect.className = "rect";
        spanRect.setAttribute('style', `background: ${allColors[i]}; border: 1px solid ${allColors[i] == '#ffffff' ? '#ccc' : allColors[i]}`);
        spanRect.style.backgroundColor = allColors[i];
        let spanValue = document.createElement('span');
        spanValue.className = "value";
        spanValue.setAttribute('data-color', allColors[i]);
        liTag.appendChild(spanRect);
        liTag.appendChild(spanValue).appendChild(document.createTextNode(allColors[i]));
        colorList.appendChild(liTag);
    }
}


// this function run in the web tabs (output in console)
const getInstanceFromEyeDropper = () => {
    document.body.style.display = 'none';
    setTimeout(async() => {
        try {
            //The EyeDropper interface represents an instance of an eyedropper tool that can be opened and used by the user to select colors from the screen.
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            await navigator.clipboard.writeText(sRGBHex);

            // Adding the color to the list if it doesn't already exist
            if (!pickedColors.includes(sRGBHex)) {
                pickedColors.push(sRGBHex);
                localStorage.setItem('picked-colors', JSON.stringify(pickedColors));
                showColors();
            }
        } catch (error) {
            console.log(error);
        }
        document.body.style.display = 'block';
    }, 5);

}

const clearAllColors = () => {
    pickedColors.length = 0;
    localStorage.setItem('picked-colors', JSON.stringify(pickedColors));
    pickedColorContainer.classList.add('hide');
}

const themeLightDark = (e) => {

    const themeDark = () => {
        if (localStorage.getItem('t_dark') !== 'false') {
            document.body.classList.add('t-dark');
        } else {
            document.body.classList.remove('t-dark');
        }
    }


    if (e.currentTarget.classList.contains('fa-sun')) {
        e.currentTarget.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('t_dark', true);
        themeDark();
    } else {
        e.currentTarget.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('t_dark', false);
        themeDark();
    }


    if (localStorage.getItem('t_dark') !== null) {
        themeDark();
    }
};


if (localStorage.getItem('t_dark') == 'true') {
    darkLightMode.classList.replace('fa-sun', 'fa-moon');
    document.body.classList.add('t-dark');
}


darkLightMode.addEventListener('click', (e) => themeLightDark(e));

colorPickerBtn.addEventListener('click', getInstanceFromEyeDropper);

clearAll.addEventListener('click', clearAllColors);