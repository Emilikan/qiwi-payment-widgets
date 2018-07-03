import './style.css';
import {getContrastColorByBackground, styleCode} from "../../modules/helpers";

export default function Link (public_key = '') {
    const container = document.createElement('div');

    const widgetLink = 'https://widget.qiwi.com';

    container.innerHTML = `<a href="${widgetLink}?public_key=${public_key}" target="_blank" class="widget__be-partner" id="partner-link">У меня есть сайт</a>`;

    const link = container.firstChild;

    const component = {
        element: link,
        addPublicKey: (public_key) => {
            link.href = `${widgetLink}?public_key=${public_key}`;
        },
        init: (data) => {
            component.addPublicKey(data.merchant_public_key);
            if (data.merchant_styles[styleCode.WIDGET_BACKGROUND]) {
                component.changeColor(data.merchant_styles[styleCode.WIDGET_BACKGROUND]);
            }
        },
        changeColor: (backgroundColor) => {
            component.element.style.color = getContrastColorByBackground(backgroundColor);
        }
    };

    return component;
}
