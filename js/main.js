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
    colorList.innerHTML = pickedColors.map(color => `
    <li class="color">
        <span class="rect" style="background: ${color}; border: 1px solid ${color == '#ffffff' ? '#ccc' : color}"></span>
        <span class="value" data-color="${color}">${color}</span>
    </li>
`).join("");

    pickedColorContainer.classList.remove('hide');

    document.querySelectorAll('.color').forEach((li) => {
        li.addEventListener('click', e => copyColor(e.currentTarget.lastElementChild))
    });
}
showColors();
// function createLiTag(color) {
//     const lisTag = [];
//     let liTag = document.createElement('li');
//     liTag.className = "color";
//     let spanRect = document.createElement('span');
//     spanRect.className = "rect";
//     spanRect.style.backgroundColor = color;
//     let spanValue = document.createElement('span');
//     spanValue.className = "value";
//     liTag.appendChild(spanRect);
//     liTag.appendChild(spanValue).appendChild(document.createTextNode(color));
//     lisTag.push(liTag);
//     console.log(lisTag);
//     // return lisTag;
// }

// this function run in the web tabs (output in console)
const activateEyeDropper = async() => {
    try {
        const eyeDropper = new EyeDropper();
        const { sRGBHex } = await eyeDropper.open();
        await navigator.clipboard.writeText(sRGBHex);

        // Adding the color to the list if it doesn't already exist
        if (!pickedColors.includes(sRGBHex)) {
            pickedColors.push(sRGBHex);
            localStorage.setItem('picked-colors', JSON.stringify(pickedColors));
            console.log(JSON.stringify(pickedColors).charAt(1));
            colorPickerBtn.style.background = JSON.stringify(pickedColors);
            showColors();
        }
    } catch (error) {
        console.log(error);
    }
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
colorPickerBtn.addEventListener('click', activateEyeDropper);
clearAll.addEventListener('click', clearAllColors);