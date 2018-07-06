import './style.css';
import {color, getContrastColorByBackground, styleCode} from '../../modules/helpers';

export default function Desc () {
    const desc = document.createElement('div');

    desc.className = 'widget__text';

    desc.innerHTML = ``;

    const component = {
        changeText: (text = '') => {
            desc.innerHTML = text;
        },
        changeColor: (backgroundColor) => {
            desc.style.color = getContrastColorByBackground(backgroundColor);
        },
        init: (data) => {
            component.changeText(data.widget_description);
            const bgColor = data.widget_styles[styleCode.WIDGET_BACKGROUND] || color.WHITE;
            component.changeColor(bgColor);
        },
        element: desc
    };

    return component;
}
